# Pixel do Tempo

Restauração de fotos antigas com inteligência artificial. Envie uma foto deteriorada e receba uma versão restaurada em segundos.

## Stack

- **Framework:** Next.js 16 (App Router)
- **Banco de dados / Auth:** Supabase
- **Pagamentos:** Stripe
- **IA / Restauração:** Replicate
- **Estilo:** Tailwind CSS v4 + shadcn/ui
- **Linting / Formatação:** Biome

## Setup local

### 1. Instale as dependências

```bash
npm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env.local
```

Preencha os valores em `.env.local`:

| Variável | Onde obter |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Dashboard do projeto no Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Dashboard do projeto no Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Dashboard do projeto no Supabase |
| `STRIPE_SECRET_KEY` | Dashboard do Stripe (modo teste ou produção) |
| `STRIPE_WEBHOOK_SECRET` | Stripe CLI (`stripe listen`) ou webhook configurado |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Dashboard do Stripe |
| `REPLICATE_API_TOKEN` | replicate.com/account |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` em desenvolvimento |

### 3. Inicialize o banco de dados

Execute `supabase/schema.sql` no SQL Editor do Supabase e, opcionalmente, `supabase/seed.sql` para dados iniciais.

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Inicia o servidor de produção |
| `npm run lint` | Verifica código com Biome |
| `npm run format` | Formata código com Biome |
