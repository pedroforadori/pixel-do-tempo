// Uso: node scripts/delete-user.mjs <email>
// Requer SUPABASE_SERVICE_ROLE_KEY e NEXT_PUBLIC_SUPABASE_URL no .env.local
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

const email = process.argv[2];
if (!email) {
  console.error('Uso: node scripts/delete-user.mjs <email>');
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const { data, error } = await supabase.auth.admin.listUsers();
if (error) {
  console.error('Erro ao listar usuários:', error.message);
  process.exit(1);
}

const user = data.users.find((u) => u.email === email);
if (!user) {
  console.error(`Usuário com email ${email} não encontrado em auth.users`);
  process.exit(1);
}

console.log(`Encontrado: ${user.id} (${user.email})`);

const { error: delError } = await supabase.auth.admin.deleteUser(user.id);
if (delError) {
  console.error('Erro ao deletar usuário:', delError.message);
  process.exit(1);
}

console.log('Usuário removido de auth.users.');

// profiles/credits/etc devem cair via ON DELETE CASCADE,
// mas conferimos se sobrou algo em public.profiles
const { data: leftover } = await supabase
  .from('profiles')
  .select('id, email')
  .eq('id', user.id);

if (leftover && leftover.length > 0) {
  console.log('Removendo registro remanescente em public.profiles...');
  await supabase.from('profiles').delete().eq('id', user.id);
}

console.log('Concluído.');
