# Linqu.es

Páginas de links prontas em minutos. A pessoa responde um questionário curto (profissão, objetivo, estilo, links) e ganha uma página em `linqu.es/:username`, montada a partir de **4 modelos** e **10 paletas** — sem configurar cor por cor.

## Stack

| Camada | Tecnologia |
|---|---|
| App | Next.js 16 (App Router) + React 19 + TypeScript |
| Estilo | Tailwind CSS 4, tokens por paleta (`lib/palettes.ts`) |
| Dados | Supabase (Auth, Postgres + RLS, Storage) |
| Pagamento | Stripe (edge functions do Supabase) |
| Deploy | Vercel |

## Comandos

```bash
npm install
npm run dev       # http://localhost:3000
npm run build
npm run lint      # tsc + eslint
npm test          # vitest
```

Variáveis: copie `.env.example` para `.env.local`.

## Como funciona

- **Modelos** (`components/templates/`): Editorial, Cartão, Vitrine (PRO) e Mínimo.
- **Paletas** (`lib/palettes.ts`): cada uma define fundo, superfície, texto, legenda, fio e destaque.
- **Questionário** (`/criar`): `lib/builder.ts` transforma as respostas em modelo + paleta + blocos.
- **Painel** (`/painel`): Conteúdo, Estilo, Perfil, Números e plano.
- **Página pública** (`/[username]`): renderizada no servidor, em cache, com Open Graph.

Bancadas de desenvolvimento: `/preview` (todos os modelos × paletas), `/preview/criar` e `/preview/painel`.

## Banco

O esquema da v2 está em `supabase/migrations/100_v2_reset.sql` (destrutiva: apaga links e temas da v1). Faça backup antes de rodar no SQL Editor.
