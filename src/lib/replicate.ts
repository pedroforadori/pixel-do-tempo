import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

// FLUX.1 Kontext Pro: model oficial BFL para edição contextual de imagens.
// Guiado por prompt — restaura mantendo identidade original sem over-enhance.
// Para atualizar: replicate.com/black-forest-labs/flux-kontext-pro
const FLUX_KONTEXT_PRO = "black-forest-labs/flux-kontext-pro";

const RESTORE_PROMPT =
  "Restore this old damaged photograph. Fix scratches, tears, fading, stains, and aging artifacts. " +
  "Preserve the original identity and facial features of all people. " +
  "Keep the historical atmosphere, original tones, and authentic character. " +
  "Make it look like a clean, well-preserved original photo — not AI-generated.";

async function runWithRetry<T>(fn: () => Promise<T>, retries = 2, delayMs = 12000): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      const is429 =
        err instanceof Error &&
        (err.message.includes("429") || err.message.includes("throttled"));
      if (is429 && attempt < retries) {
        console.warn(`[replicate] rate limited, waiting ${delayMs}ms before retry ${attempt + 1}/${retries}`);
        await new Promise((r) => setTimeout(r, delayMs));
        continue;
      }
      throw err;
    }
  }
  throw new Error("max retries exceeded");
}

function extractUrl(output: unknown): string {
  if (typeof output === "string") return output;
  // Replicate SDK v1.x: FileOutput.url é um método (não uma propriedade)
  if (typeof output === "function") return String(output());
  if (output instanceof URL) return output.toString();
  if (Array.isArray(output) && output.length > 0) return extractUrl(output[0]);
  if (output && typeof output === "object") {
    if ("url" in output) return extractUrl((output as { url: unknown }).url);
    // FileOutput implementa toString() retornando a URL
    const str = String(output);
    if (str.startsWith("http")) return str;
  }
  throw new Error(`Formato de saída inesperado: ${typeof output} — ${JSON.stringify(output)}`);
}

export async function restorePhoto(imageUrl: string): Promise<string> {
  const output = await runWithRetry(() =>
    replicate.run(FLUX_KONTEXT_PRO, {
      input: {
        prompt: RESTORE_PROMPT,
        input_image: imageUrl,
        output_format: "jpg",
        output_quality: 90,
        safety_tolerance: 6,
      },
    })
  );

  return extractUrl(output);
}
