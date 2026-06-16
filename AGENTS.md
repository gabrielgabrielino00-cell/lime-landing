<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# LimeForge — contesto progetto (aggiornato giu 2026)

## Regole assolute
- **Progetto attivo:** `C:\Users\chiar\lime-landing` (LimeForge). Solo locale, niente deploy cloud.
- **NON toccare:** `C:\Users\chiar\hero-3d` (Elettronica51).
- **Repo GitHub:** `gabrielgabrielino00-cell/lime-landing`
- L'utente configurerà **GitHub OAuth da solo** — lasciare placeholder in `.env.local`.
- **Non avviare** il dev server in background: l'utente lo lancia nel suo PowerShell.

## Stack
- Next.js 16, NextAuth v5, DB locale JSON (`.limeforge-data/db.json`)
- Route principali: `/`, `/login`, `/app`, `/app/[projectId]`, `/dashboard`, `/settings`, `/setup`

## Login
- **Dev login:** "Continue as Dev User (local)" via credentials `dev-login`
- OAuth GitHub/Google solo se `AUTH_GITHUB_ID/SECRET` o `AUTH_GOOGLE_ID/SECRET` sono impostati
- Callback GitHub: `http://localhost:3000/api/auth/callback/github`

## AI
- Modalità demo senza API keys; tutti i modelli sbloccati
- Streaming SSE in `src/lib/sse.ts`

## Layout chat (fix applicato)
- `.app-viewport` = fixed, `100dvh`, overflow hidden (solo `/app`)
- Chat: grid `header | messaggi scroll | input fisso in basso`
- `body` senza `overflow-hidden` così la landing scorre
- Classi CSS: `.chat-panel`, `.chat-panel-messages`, `.chat-panel-input`

## PowerShell — avvio pulito
```powershell
cd C:\Users\chiar\lime-landing
npm run stop
npm run dev
```
Script: `scripts/start-dev.ps1` (UTF-8, chiude porta 3000, output leggibile).

## .env.local (stato)
- `AUTH_SECRET` e `AUTH_URL=http://localhost:3000` impostati
- `AUTH_GITHUB_ID/SECRET` vuoti — l'utente li compila
