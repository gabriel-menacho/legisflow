# LegisFlow — Agent Notes

## Mock demo mode

To run the full frontend without a backend (all data simulated in-browser):

```bash
npm run dev:web:mock
```

This uses `packages/web/.env.local` which sets:
- `NEXT_PUBLIC_MOCK_API=true` — swaps all API calls to in-memory mock
- `NEXT_PUBLIC_MOCK_AUTO_LOGIN=true` — auto-injects demo tokens

Auto-login is also hardcoded in `auth-provider.tsx` for mock mode (no env var needed).
Login redirect is bypassed in `portal-shell.tsx` when mock mode is active.

No registration, login, or backend needed.
