# Linqu.es

Plataforma de bio links estilo Linktree. Cada usuário tem uma página pública em `linqu.es/:username` com links personalizados, temas animados e preview em tempo real.

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 19 + Vite 6 + TypeScript |
| Estilização | Tailwind CSS 4 |
| Roteamento | React Router 7 |
| Animações | Motion (Framer Motion) |
| Temas WebGL | Three.js + React Three Fiber + Drei |
| SSR / OG | Vercel Function (`api/ssr.ts`) |
| BaaS | Supabase (Auth + Postgres + Storage + RLS) |
| Deploy | Vercel |

## Comandos

```bash
npm install       # instalar dependências
npm run dev       # dev server na porta 3000 (Express + Vite)
npm run build     # build do frontend para dist/
npm run lint      # type-check (tsc --noEmit)
npm run test      # rodar testes (Vitest)
```

Acesse em **http://localhost:3000** (Windows).

## Arquitetura

### Server (`server.ts`)

Express que serve o Vite em dev ou `dist/` em produção. Sem rotas de API — todos os dados passam pelo cliente Supabase no frontend.

### SSR + Open Graph (`api/ssr.ts`)

Vercel Function que intercepta todas as requisições via rewrite. Para rotas `/:username`, busca os dados do perfil no Supabase e injeta meta tags `og:title`, `og:description`, `og:image`, `twitter:card` no `index.html` antes de servir. Resolve SEO e previews de compartilhamento em redes sociais.

### Banco — Supabase

Projeto: `uohxrknmwhglnzbdxedx`

Credenciais em `.env.local` (gitignored). Client em `src/lib/supabase.ts`.

**Tabelas:**
- `profiles` — uma linha por usuário, keyed por `id = auth.users.id`. Campos de tema, fontes, bio, avatar, plano.
- `links` — pertence a um profile via `profile_id`. Campos: `title`, `url`, `icon_type`, `sort_order`, `clicks`, `is_active`.

RLS habilitado. Trigger `on_auth_user_created` cria a linha de profile automaticamente no signup usando `raw_user_meta_data`.

### Autenticação

Supabase Auth (email + senha). Estado em `src/contexts/AuthContext.tsx` via `onAuthStateChange`. O `signUp` passa `{ data: { username, display_name } }` para o trigger.

### Frontend (`src/`)

| Arquivo | Responsabilidade |
|---|---|
| `src/lib/supabase.ts` | Client Supabase (usa `import.meta.env.VITE_*`) |
| `src/lib/fonts.ts` | Carrega Google Fonts sob demanda com deduplicação |
| `src/lib/plans.ts` | Regras de negócio de planos (free/pro) — funções puras |
| `src/lib/themeConfig.ts` | Configuração de temas pro via Supabase |
| `src/lib/customThemes.ts` | Temas customizados com mídia no Supabase Storage |
| `src/contexts/AuthContext.tsx` | `AuthProvider` + `useAuth` hook |
| `src/types.ts` | `Profile`, `Link`, `ICON_MAP`, `FONT_OPTIONS`, `BUTTON_STYLE_OPTIONS`, `cn()` |
| `src/App.tsx` | Routing: `/dashboard`, `/entrar`, `/:username` |
| `src/components/AuthPage.tsx` | Login + registro com verificação de username |
| `src/components/Dashboard.tsx` | Tabs: Links, Tema, Aparência, Perfil, Preview |
| `src/components/PublicProfile.tsx` | Página pública, aplica tema via inline styles |
| `src/components/AdminPanel.tsx` | Painel de administração |
| `src/themes/` | Sistema de temas extensível |

### Sistema de Temas

Interface `ThemeDefinition` em `src/themes/types.ts`. Todos os temas são carregados com `React.lazy()` para não inflar o bundle inicial. Para adicionar um tema: criar `Background.tsx` e registrar em `src/themes/index.ts`.

Categorias de temas disponíveis:
- **Clássico** — fundo sólido customizável
- **WebGL** — Mercury, Quantum, Void (Three.js)
- **Canvas 2D** — Laser, Constellation, Ripple, Flow, Fireflies, Bubbles
- **CSS** — Aurora, Sunset, Neon
- **Profissões** — Advocacia, Medicina, Odontologia, Psicologia, Dev

### Sistema de Planos

`src/lib/plans.ts` — funções puras sem dependências React/Supabase:
- Free: até 5 links, apenas tema Clássico
- Pro: links ilimitados, todos os temas

### Tema (aparência)

Armazenado como campos diretos em `profiles`. Aplicado via inline styles em `PublicProfile` e `MobilePreview`:
- `bg_color`, `text_color`, `font_family` do perfil
- Border-radius dos botões via `button_style` (`rounded`/`pill`/`square`/`outline`/`soft`/`wave`/`leaf`)
- Suporte a imagem de fundo (`bg_image_url`) com upload para Supabase Storage
- Avatar via upload (compressão + crop circular) ou preset DiceBear

## Variáveis de Ambiente

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Deploy

Deploy via Vercel. O `vercel.json` configura:
- Build: `npm run build` → `dist/`
- `api/ssr.ts` como Vercel Function com `dist/index.html` incluído
- Rewrite `/*` → `/api/ssr` para SSR + injeção de OG tags

## Pendências Técnicas

| Item | Descrição |
|---|---|
| PERF-1 | Reorder de links usa N queries individuais — migrar para upsert em batch |
| PERF-3 | Click tracking sem `.catch()` — adicionar tratamento de erro |
| SEG-3 | Sem rate limiting no Express para dev local |
| ESCALA-3 | Analytics por click limitado a contador — sem referrer/device/país |
| ESCALA-4 | Domínio customizado por usuário não implementado |
| Testes | Vitest configurado mas sem arquivos de teste |
