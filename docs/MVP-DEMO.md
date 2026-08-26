# REagent MVP — Demo runbook

## One-time setup

1. Copy env: `cp .env.example .env.local` and fill keys.
2. Push DB schema: `npm run db:push`
3. In Vapi assistant → Advanced → Server URL:
   - Local: tunnel URL + `/api/vapi/webhook`
   - Prod: `https://reagent.asquares.app/api/vapi/webhook`
4. Enable `end-of-call-report` on that assistant.
5. Leave `VAPI_WEBHOOK_SECRET` empty for local MVP.

## Local demo loop

```bash
npm run db:push
npm run dev
```

Optional tunnel (needed for Vapi webhook while undeployed):

```bash
npx cloudflared tunnel --url http://localhost:3000
```

Paste the printed HTTPS URL into Vapi Server URL as:
`https://YOUR-TUNNEL/api/vapi/webhook`

### Click path

1. Open `http://localhost:3000`
2. Click **My Apps** → sign in with an allowlisted email
3. Open **REagent** (uses same-origin `/reagent` locally so Clerk session works)
4. Open dashboard → **Start demo Web Call**
5. Speak as a buyer (area, budget, BHK, timeline)
6. End call → wait ~10–40s while webhook + Gemini run
7. Lead appears in inbox; email lands at `REAGENT_ALERT_TARGET`

## Notes

- Local product URL prefers `http://localhost:3000/reagent` (same Clerk cookie).
- Production uses `https://reagent.asquares.app` via host rewrite in `src/proxy.ts`.
- Resend free tier: keep `REAGENT_ALERT_FROM=REagent <onboarding@resend.dev>` until domain is verified.
- Gemini key must be an AI Studio key (`AIza…`). Set `GEMINI_MODEL=gemini-3.6-flash`.
