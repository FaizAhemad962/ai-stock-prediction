# AI Stock Prediction Project Instructions

## Product phase

The frontend UI foundation is complete and the project is entering the backend integration phase. Follow `docs/UI-STATUS.md` and `docs/BACKEND-ROADMAP.md`; preserve the existing UI structure and contracts while adding Python/FastAPI services.

Settings is only partially complete. Preserve its current layout and local preference controls, then connect account, security, authenticated preferences, and real logout through backend contracts rather than inventing frontend-only identity behavior.

## Architecture

- Preserve the current Vite + React + TypeScript structure.
- Preserve the route paths and `MainLayout`/`Outlet` architecture unless a change is required by a user request.
- Keep page components under `src/pages/<PageName>/` and shared components under `src/components/<ComponentName>/`.
- Keep shared layout code under `src/layouts/`, mock data under `src/data/`, and domain contracts under `src/types/`.
- Do not reorganize the repository or introduce a replacement architecture during UI polish.
- Prefer typed domain data in `src/types/` and mock data in `src/data/`.
- Prefer existing lucide-react icons and React Router primitives over custom equivalents.
- Keep temporary mock records centralized in `src/data/mockData.ts` and typed through `src/types/`; do not hard-code duplicate stock, news, portfolio, or prediction values inside pages or reusable components.
- Keep future backend responses compatible with the existing UI contracts so provider changes do not require page rewrites.
- Keep all provider, OpenAI, OAuth, database, and JWT secrets server-side. Never expose them through React or `VITE_` variables.

## Style preservation

- Keep `src/index.css` as the primary stylesheet and preserve the existing visual language, CSS variables, typography, dark dashboard palette, card treatment, spacing, and signal colors.
- Consolidate duplicate CSS instead of adding competing global overrides.
- Do not replace the current CSS approach with Tailwind, CSS modules, a component library, or inline styles unless explicitly requested.
- Do not redesign the brand, route layout, navigation, colors, or typography as part of UI integration work.
- Add responsive rules without breaking the existing desktop layout or 320px mobile support.
- Extract repeated patterns incrementally and keep changes narrowly scoped to the current milestone.

## UI standards

- Build shared `Card`, `StatCard`, `Badge`, `StockRow`, `SectionHeader`, `LoadingState`, `EmptyState`, and `ErrorState` primitives before duplicating page markup.
- Every data-bearing page must define loading, empty, error, and not-found behavior where applicable.
- Use semantic `Link`/`NavLink` elements for navigation and `button` elements for actions. Do not use clickable `div` elements.
- Every interactive control must have an accessible name, visible keyboard focus, and a working action or an intentionally disabled state.
- Keep desktop, tablet, and 320px mobile layouts usable. Do not make routes inaccessible on mobile; Settings is intentionally reached through the Profile menu rather than duplicated in bottom navigation.
- Keep the existing visual language and CSS variables in `src/index.css`; consolidate duplicate selectors instead of adding more global overrides.

## Validation

Before considering UI work complete, run:

```text
npm run build
npm run lint
```

Also manually verify every route, stock navigation flow, empty/error state, and the mobile layout. Do not mark a milestone complete while either command fails.

## Scope discipline

- Do not fix unrelated bugs or rewrite the application architecture.
- Do not commit secrets or expose future API keys in React code.
- Build backend capabilities in the documented order: health/contracts, market data, Stock Details, frontend data access, News, user features, prediction, then AI explanations.
- Update `docs/UI-STATUS.md` when a milestone changes.
- Keep mock data replaceable by future backend responses through stable TypeScript contracts.
