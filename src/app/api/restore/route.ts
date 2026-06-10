import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient, createAdminStorageClient } from "@/lib/supabase/server";
import { restorePhoto } from "@/lib/replicate";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: NextRequest) {
  // supabase  → cliente do usuário (respeita RLS com o JWT do usuário)
  // serviceSupabase → só para RPCs com SECURITY DEFINER (consume/add credits)
  // adminStorage → storage sem RLS
  const supabase = await createClient();
  const serviceSupabase = createServiceClient();
  const adminStorage = createAdminStorageClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── Parse multipart form ──────────────────────────────────────────────────
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "no_file" }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "invalid_format" }, { status: 415 });
  }

  const MAX_SIZE = 30 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "file_too_large" }, { status: 413 });
  }

  // ── Auth / credit gate ────────────────────────────────────────────────────
  if (!user) {
    return NextResponse.json({ error: "signup_required" }, { status: 403 });
  }

  let creditConsumed = false;
  let restorationId: string | null = null;
  const jobId = uuidv4();
  const userId = user.id;

  try {
    // ── Consume credit via RPC SECURITY DEFINER (bypassa RLS por design) ──
    const { error: creditError } = await serviceSupabase.rpc("consume_credits", {
      p_user_id: userId,
      p_amount: 1,
    });

    if (creditError) {
      if (creditError.message.includes("insufficient_credits")) {
        return NextResponse.json({ error: "insufficient_credits" }, { status: 402 });
      }
      throw creditError;
    }
    creditConsumed = true;

    // ── Upload original (adminStorage bypassa RLS de storage) ────────────
    const ext = file.type === "image/png" ? "png" : "jpg";
    const storagePath = `${userId}/${jobId}-original.${ext}`;
    const arrayBuffer = await file.arrayBuffer();
    const rawBuffer = Buffer.from(arrayBuffer);

    // Real-ESRGAN GPU limit: ~2 096 704 pixels. Resize to fit before sending.
    const MAX_PIXELS = 2_000_000;
    const image = sharp(rawBuffer);
    const meta = await image.metadata();
    const w = meta.width ?? 0;
    const h = meta.height ?? 0;
    const buffer =
      w * h > MAX_PIXELS
        ? await image
            .resize({
              width: Math.floor(w * Math.sqrt(MAX_PIXELS / (w * h))),
              height: Math.floor(h * Math.sqrt(MAX_PIXELS / (w * h))),
              fit: "inside",
              withoutEnlargement: true,
            })
            .toBuffer()
        : rawBuffer;

    const { error: uploadError } = await adminStorage
      .from("restorations")
      .upload(storagePath, buffer, { contentType: file.type, upsert: false });

    if (uploadError) throw uploadError;

    // ── Signed URL para o Replicate ───────────────────────────────────────
    const { data: signedData, error: signedError } = await adminStorage
      .from("restorations")
      .createSignedUrl(storagePath, 120);

    if (signedError || !signedData?.signedUrl) {
      throw signedError ?? new Error("signed_url_failed");
    }

    // ── Criar registro no banco (usa JWT do usuário → RLS satisfeita) ────
    const { data, error: dbError } = await supabase
      .from("restorations")
      .insert({ user_id: userId, original_url: storagePath, status: "processing" })
      .select("id")
      .single();

    if (dbError) throw dbError;
    restorationId = data.id;

    // ── Chamar Replicate ──────────────────────────────────────────────────
    const restoredExternalUrl = await restorePhoto(signedData.signedUrl);

    // ── Download resultado e re-upload para storage ───────────────────────
    const restoredResponse = await fetch(restoredExternalUrl);
    if (!restoredResponse.ok) throw new Error("failed_to_fetch_result");
    const restoredRaw = Buffer.from(await restoredResponse.arrayBuffer());

    // Cap the restored image at 2000px on the longest side to keep storage size sane.
    const restoredMeta = await sharp(restoredRaw).metadata();
    const rw = restoredMeta.width ?? 0;
    const rh = restoredMeta.height ?? 0;
    const MAX_SIDE = 2000;
    const restoredBuffer =
      rw > MAX_SIDE || rh > MAX_SIDE
        ? await sharp(restoredRaw)
            .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: "inside", withoutEnlargement: true })
            .toBuffer()
        : restoredRaw;

    const restoredPath = `${userId}/${jobId}-restored.${ext}`;
    const { error: restoredUploadError } = await adminStorage
      .from("restorations")
      .upload(restoredPath, restoredBuffer, { contentType: file.type, upsert: false });

    if (restoredUploadError) throw restoredUploadError;

    // ── Signed URLs para retornar ao client (1 hora) — em paralelo ───────
    const [{ data: resultSigned, error: resultSignedError }, { data: originalSigned, error: originalSignedError }] =
      await Promise.all([
        adminStorage.from("restorations").createSignedUrl(restoredPath, 3600),
        adminStorage.from("restorations").createSignedUrl(storagePath, 3600),
      ]);

    if (resultSignedError || !resultSigned?.signedUrl || originalSignedError || !originalSigned?.signedUrl) {
      throw resultSignedError ?? originalSignedError ?? new Error("signed_url_failed");
    }

    // ── Atualizar status (usa JWT do usuário) ─────────────────────────────
    if (restorationId) {
      await supabase
        .from("restorations")
        .update({ status: "completed", restored_url: restoredPath })
        .eq("id", restorationId);
    }

    return NextResponse.json({
      restoredUrl: resultSigned.signedUrl,
      originalUrl: originalSigned.signedUrl,
      restorationId,
    });
  } catch (error) {
    // ── Cleanup ───────────────────────────────────────────────────────────
    const msg = error instanceof Error ? error.message : "unknown_error";

    if (restorationId) {
      await supabase
        .from("restorations")
        .update({ status: "failed", error_msg: msg })
        .eq("id", restorationId);
    }

    if (creditConsumed && userId) {
      await serviceSupabase.rpc("add_credits", { p_user_id: userId, p_amount: 1 });
    }

    console.error("[/api/restore] error:", error);

    if (msg.includes("maximum allowed size")) {
      return NextResponse.json({ error: "storage_limit" }, { status: 413 });
    }

    return NextResponse.json(
      { error: "restore_failed", detail: msg },
      { status: 500 }
    );
  }
}
