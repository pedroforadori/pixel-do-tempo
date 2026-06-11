// Cria profiles/credits faltantes para usuarios que existem em auth.users
// mas nao tem registro em public.profiles (caso a trigger on_auth_user_created
// nao tenha sido aplicada/disparada).
//
// Uso: node scripts/backfill-profiles.mjs
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

function loadEnv(path) {
  try {
    for (const line of readFileSync(path, 'utf8').split('\n')) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
    }
  } catch {}
}
loadEnv('.env.local');
loadEnv('.env');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers({ perPage: 1000 });
if (usersError) {
  console.error('Erro ao listar usuários:', usersError.message);
  process.exit(1);
}

const { data: profiles, error: profilesError } = await supabase.from('profiles').select('id');
if (profilesError) {
  console.error('Erro ao listar profiles:', profilesError.message);
  process.exit(1);
}

const existingIds = new Set(profiles.map((p) => p.id));
const missing = usersData.users.filter((u) => !existingIds.has(u.id));

console.log(`Total usuários: ${usersData.users.length}`);
console.log(`Profiles existentes: ${profiles.length}`);
console.log(`Faltando: ${missing.length}`);

for (const user of missing) {
  console.log(`Criando profile para ${user.email} (${user.id})...`);

  const { error: profileError } = await supabase.from('profiles').insert({
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name ?? null,
    avatar_url: user.user_metadata?.avatar_url ?? null,
  });
  if (profileError) {
    console.error(`  Erro ao criar profile: ${profileError.message}`);
    continue;
  }

  const { error: creditsError } = await supabase
    .from('credits')
    .insert({ user_id: user.id, balance: 0 })
    .select()
    .single();
  if (creditsError && creditsError.code !== '23505') {
    console.error(`  Erro ao criar credits: ${creditsError.message}`);
  }
}

console.log('Concluído.');
