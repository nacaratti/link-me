# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # Install dependencies
npm run dev       # Start dev server (Express + Vite on port 3000)
npm run build     # Build frontend to dist/
npm run lint      # TypeScript type-check (tsc --noEmit)
```

No test suite. Type-checking via `npm run lint` is the primary static validation.

On Windows, access the app at **http://localhost:3000** (not http://0.0.0.0:3000).

## Architecture

**Linques** — a Linktree-style platform at linqu.es. Each user gets a public page at `linqu.es/:username`.

### Server (`server.ts`)

Express server that mounts Vite as middleware in dev, or serves `dist/` in production. No API routes — all data goes directly through Supabase client on the frontend.

Run via: `tsx server.ts` (the `npm run dev` script).

### Database — Supabase

Project: `uohxrknmwhglnzbdxedx` (https://uohxrknmwhglnzbdxedx.supabase.co)

Credentials are in `.env.local` (gitignored). The Supabase client is in `src/lib/supabase.ts`.

**Tables:**
- `profiles` — one row per user, keyed by `id = auth.users.id`. Contains all theme fields directly (`bg_color`, `text_color`, `button_color`, `button_text_color`, `button_style`, `font_family`).
- `links` — belongs to a profile via `profile_id`. Fields: `title`, `url`, `icon_type`, `sort_order`, `clicks`, `is_active`.

Row Level Security is enabled. A DB trigger `on_auth_user_created` auto-creates the profile row when a user signs up, using `raw_user_meta_data` (`username`, `display_name`).

### Authentication

Supabase Auth (email + password). Auth state is in `src/contexts/AuthContext.tsx` via `onAuthStateChange`. The `signUp` call passes `{ data: { username, display_name } }` as user metadata for the trigger.

### Frontend (`src/`)

- `src/lib/supabase.ts` — Supabase client (uses `import.meta.env.VITE_*`)
- `src/lib/fonts.ts` — dynamically loads Google Fonts via `<link>` injection
- `src/contexts/AuthContext.tsx` — `AuthProvider` + `useAuth` hook
- `src/types.ts` — `Profile`, `Link` interfaces + `ICON_MAP`, `FONT_OPTIONS`, `BUTTON_STYLE_OPTIONS` + `cn()` utility
- `src/App.tsx` — routing: `/dashboard` (protected), `/entrar` (guest-only), `/:username` (public)
- `src/components/AuthPage.tsx` — login + register with username availability check
- `src/components/Dashboard.tsx` — three tabs: **Links** (add/delete/reorder/toggle), **Aparência** (colors + button style + font), **Perfil** (name/bio/avatar). Includes inline `MobilePreview` component.
- `src/components/PublicProfile.tsx` — public page, fetches via Supabase, applies theme via inline styles

### Theme system

Stored as plain values in `profiles` table (not JSON). Applied via **inline styles** in both `PublicProfile` and `MobilePreview`:
- `backgroundColor`, `color`, `fontFamily` from profile fields
- Button border-radius from `button_style` (`rounded`/`pill`/`square`/`outline`)
- `outline` style uses `bg-transparent` + border instead of `button_color`

### Autonomous Agents

Two autonomous agents run locally via Windows Task Scheduler + Claude CLI:

- **Leopoldo (Dev Agent)**: `.claude/agent-dev.md` — runs Mon-Fri + Sun at 02:00 AM, implements kanban cards from Notion via MCP
- **Geraldo (CEO Agent)**: `.claude/agent-ceo.md` — runs Saturday at 02:00 AM, plans weekly work, creates cards, sends Telegram report

**Supporting scripts** (`scripts/`):
- `run-dev-agent.bat`, `run-ceo-agent.bat`, `run-watchdog.bat` — batch launchers
- `supabase-agent.mjs` — activity logging to Supabase (`activity_logs`, `agent_usage`, `weekly_focus` tables)
- `telegram.mjs` — Telegram Bot API wrapper
- `record-usage.mjs` — token/cost tracking after each agent run
- `notify-failure.mjs` — Telegram alert on agent failure
- `agent-watchdog.mjs` — daily check that agents ran (09:00 AM)
- `setup-tasks.ps1` — registers Windows Scheduled Tasks (run as Admin once)

**Docs**: `docs/AUTONOMY_POLICY.md` (what agents can/cannot do), `docs/CARD_CONTRACT.md` (card structure), `docs/RUNBOOK.md` (troubleshooting)

### Key conventions

- `ICON_MAP` keys: `github`, `linkedin`, `globe`, `instagram`, `twitter`, `youtube`, `link`
- Reserved usernames checked at register time (client-side): `admin`, `help`, `settings`, `api`, `auth`, `dashboard`, `entrar`, `login`, `register`
- Google Fonts loaded lazily via `src/lib/fonts.ts` — call `loadGoogleFont(fontFamily)` before rendering
- `src/vite-env.d.ts` provides `/// <reference types="vite/client" />` so `import.meta.env` types work
