# REagent MVP — Demo runbook

## One-time setup

1. Copy env: `cp .env.example .env.local` and fill keys.
2. Push DB schema: `npm run db:push`
3. Set `REAGENT_ALLOWED_EMAILS` (required — empty allowlist blocks everyone).
4. In Vapi assistant → Advanced → Server URL:
   - Local: tunnel URL + `/api/vapi/webhook`
   - Prod: `https://asquares.app/api/vapi/webhook`
5. Enable `end-of-call-report`.
6. For production, set `VAPI_WEBHOOK_SECRET` and the same secret in Vapi.

## Local demo loop

```bash
npm run db:push
npm run dev
```

Optional tunnel (needed for Vapi webhook while undeployed):

```bash
npx cloudflared tunnel --url http://localhost:3000
```

Paste into Vapi Server URL:
`https://YOUR-TUNNEL/api/vapi/webhook`

### Click path

1. Open `http://localhost:3000`
2. Click **REagent demo** / **My Apps** → sign in with an allowlisted email
3. Open **REagent** → dashboard
4. **Start demo Web Call** → speak as a buyer
5. End call → wait for lead + email

## Notes

- Product path is always `/reagent` on the primary domain so Clerk login works.
- `reagent.asquares.app` redirects to `asquares.app/reagent` until satellite auth is added.
- Resend: keep `REAGENT_ALERT_FROM=REagent <onboarding@resend.dev>` until domain verified.
- Gemini: prefer AI Studio keys (`AIza…`) and `GEMINI_MODEL=gemini-3.6-flash`.
- If Gemini fails, a heuristic fallback still scores the lead so the demo continues.
