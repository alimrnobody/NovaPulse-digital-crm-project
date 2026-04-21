# NovaPulse Digital Client Portal

Production-ready client portal for NovaPulse Digital built with `React`, `TypeScript`, `Vite`, `Tailwind CSS`, `shadcn/ui`, and `Framer Motion`.

## What Changed

- Premium dark slate UI with indigo-led accent styling
- Secure client-side auth flow with password hashing and validation
- 5-step onboarding wizard with saved progress
- Functional document upload flow with validation and portal persistence
- n8n webhook helper for signup, onboarding step completion, and file upload events

## Local Setup

1. Install dependencies:
   `npm install`
2. Start the app:
   `npm run dev`
3. Create a production build:
   `npm run build`

## Environment Variables

Create a `.env` file in the project root if you want live integrations:

```bash
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance/webhook/novapulse
VITE_GHL_CALENDAR_URL=https://go.highlevel.com/your-calendar
```

## Demo Notes

- Auth is still browser-local because this repo has no backend yet, but email-only access has been removed.
- Uploaded documents are stored as client-side metadata in local storage for this version.
- The reset password screen is now UI-ready and should be connected to your real auth provider next.

## Scripts

- `npm run dev` starts the Vite dev server
- `npm run build` creates the production bundle
- `npm run lint` runs ESLint
- `npm test` runs Vitest
