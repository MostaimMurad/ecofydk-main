---
description: How to start and test the local dev environment
---
// turbo-all

## Dev URLs

| Page | URL |
|------|-----|
| Homepage | http://localhost:8080/ |
| Auth (Login) | http://localhost:8080/auth |
| Admin Dashboard | http://localhost:8080/admin |
| Content Manager | http://localhost:8080/admin/content |
| Media Library | http://localhost:8080/admin/media |
| Products | http://localhost:8080/admin/products |
| Blog | http://localhost:8080/admin/blog |
| Users | http://localhost:8080/admin/users |
| Translations | http://localhost:8080/admin/translations |
| Feedback | http://localhost:8080/admin/feedback |

## Dev Mode Bypasses (auto-disabled in production)

All admin routes are accessible **without login** in dev mode. The following are auto-disabled:
- **Authentication** — `ProtectedRoute.tsx` bypasses auth checks via `import.meta.env.DEV`
- **Exit-Intent Popup** — `ExitIntentPopup.tsx` skips registering mouseleave listener
- **Cookie Consent** — `CookieConsent.tsx` skips showing the banner

## Starting the Dev Server

1. Start Docker Desktop (if not running)
2. Run `npx supabase start` in the project root
3. Run `npm run dev` — Vite dev server starts at http://localhost:8080

## Going Live Checklist

Before deploying to production:
- These dev bypasses use `import.meta.env.DEV` which is **always false** in production builds (`npm run build`), so no code changes needed
- Run `npm run build` to create production bundle — auth, popups, and cookies will all work normally
