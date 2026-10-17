# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # Install dependencies
npm run dev       # Next dev server on port 3000
npm run build     # Production build
npm run lint      # tsc --noEmit + eslint
npm test          # Vitest (lib/__tests__)
npm run icons     # Regenerate components/BrandIcon.tsx from simple-icons
```

On Windows, access the app at **http://localhost:3000**.

This is Next.js 16 — APIs differ from older versions (e.g. `middleware.ts` is now `proxy.ts`). Check `node_modules/next/dist/docs/` before using an unfamiliar API.

## Product (v2)

**Linques** — link-in-bio pages at `linqu.es/:username`. A page is **one template + one palette + blocks**. There is deliberately no per-item color, font or button-style setting.

- A guided questionnaire (`/criar`, chat-style, buttons — no AI) builds the page.
- The panel (`/painel`) has 4 tabs: Conteúdo, Estilo (template + palette only), Perfil, Números e plano.
- Free: 5 links, templates Editorial/Cartão/Mínimo, palettes Papel/Grafite/Terracota/Oceano. PRO (Stripe): 50 links, Vitrine, all 10 palettes, full stats, no "feito com linqu.es".

## Architecture

### Design system

- `lib/palettes.ts` — closed palettes; each becomes CSS vars `--p-*` on the page wrapper (`paletteVars`). Tailwind tokens in `app/globals.css` (`@theme inline`): `bg`, `surface`, `ink`, `muted`, `rule`, `accent`, `on-accent`. Templates only use these classes — never raw colors.
- `lib/templates.ts` + `components/templates/{Editorial,Cartao,Vitrine,Minimo}.tsx` — each template fixes its layout and font pair (`.tpl-*` classes set `--f-display/--f-body/--f-label`; fonts loaded in `app/fonts.ts`).
- `components/page/PageView.tsx` — renders a page; the **same component** is used on the public page, the panel preview and the questionnaire preview (`preview` prop swaps fixed/viewport sizes for in-frame ones).
- Editorial is the `/links` page from the Silvério Pontes v2 site generalized (photo rotator, mono label, serif name, ruled rows).

### Data (Supabase)

Project `uohxrknmwhglnzbdxedx`. Schema comes from `supabase/migrations/100_v2_reset.sql` (supabase/ is gitignored — keep the file locally).

- `profiles` — `username`, `display_name`, `headline`, `bio`, `avatar_url`, `photos text[]`, `template_id`, `palette_id`, `whatsapp_number`, `whatsapp_enabled`, `plan`, Stripe columns, `onboarding_answers`, `onboarded_at`.
- `blocks` — `type` (`link` | `featured`), `data jsonb`, `sort_order`, `is_active`, `clicks`.
- `page_view_events`, `block_click_events` — written only via RPCs `track_view` / `track_click` (block_id NULL = WhatsApp click).
- Column-level grants hide Stripe columns from `anon`/`authenticated`: **never `select("*")` on profiles** — use `PUBLIC_PROFILE_COLUMNS` (`lib/data.ts`) or `OWN_PROFILE_COLUMNS` (`lib/session.ts`).
- Triggers enforce plan limits (`LINK_LIMIT`, `PRO_TEMPLATE`, `PRO_PALETTE`); `lib/plans.ts` mirrors them and `planErrorMessage` translates them.
- Bucket `media` (public), path `{user_id}/…`; uploads via `lib/upload.ts`.

### Code map

- `lib/supabase/{server,client,anon}.ts` — cookie client (server), browser client, cache-safe anon client.
- `proxy.ts` — refreshes the session; guards `/painel` and `/criar`.
- `lib/data.ts` — `getPublicPage` (cached with `unstable_cache`, tag `page:<username>`). Mutations call `updateTag(pageTag(u))` + `revalidatePath('/u')`.
- `lib/profile.ts` — `effectiveStyle` downgrades PRO template/palette at render time for free users.
- `lib/builder.ts` — `buildPage(answers, plan)`: pure questionnaire → page function. Presets per profession in `lib/presets.ts`.
- `lib/links.ts` — URL normalization, brand detection, default titles/notes, WhatsApp URL.
- `app/[username]/page.tsx` — public page (ISR, OG metadata, `Tracker` client component for views/clicks).
- `app/criar/` — questionnaire (`Wizard.tsx`, `steps.tsx`, `actions.ts`).
- `app/painel/` — panel (`Painel.tsx`, `tabs/*`, `actions.ts`).
- `app/preview/*` — dev-only benches (all templates × palettes; questionnaire and panel without login).
- Stripe: Supabase edge functions `payment-create`, `payment-webhook`, `subscription-cancel` (called with `functions.invoke`).

### Conventions

- UI copy is Brazilian Portuguese.
- Reserved usernames live in `lib/reserved.ts` (used at signup and in routing).
- Shared app UI pieces (chips, buttons, toggle, photo picker, palette swatch) are in `components/ui.tsx`.

### Autonomous Agents

Two agents run locally via Windows Task Scheduler + Claude CLI:

- **Leopoldo (Dev Agent)**: `.claude/agent-dev.md` — Mon-Fri + Sun 02:00, implements Notion kanban cards.
- **Geraldo (CEO Agent)**: `.claude/agent-ceo.md` — Saturday 02:00, plans the week, sends Telegram report.

Scripts in `scripts/` (`run-*.bat`, `supabase-agent.mjs`, `telegram.mjs`, `record-usage.mjs`, `notify-failure.mjs`, `agent-watchdog.mjs`, `setup-tasks.ps1`). Docs: `docs/AUTONOMY_POLICY.md`, `docs/CARD_CONTRACT.md`, `docs/RUNBOOK.md`.
