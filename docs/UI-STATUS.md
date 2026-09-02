# AI Stock Prediction UI Status

## Purpose

This document is the current frontend source of truth for the AI Stock Prediction application. It records what is implemented, what is incomplete, and what must be finished before Python/FastAPI and external API work begins.

The application currently uses Vite, React 19, TypeScript, React Router, lucide-react, and mock/static content. No market, news, authentication, database, or AI API is connected yet.

## Structure and Style Contract

The existing architecture and visual language are approved foundations. Future work must follow them rather than replace them.

### Code structure rules

- Keep the current Vite + React + TypeScript setup.
- Keep the existing route paths and `MainLayout`/`Outlet` architecture.
- Keep route-level screens under `src/pages/<PageName>/`.
- Keep reusable UI under `src/components/<ComponentName>/`.
- Keep shared layout code under `src/layouts/`.
- Keep mock/static data under `src/data/` and shared contracts under `src/types/`.
- Add files only when they support an existing responsibility; do not reorganize the repository into a new architecture.
- Reuse React Router primitives, existing components, and lucide-react icons before introducing alternatives.
- Do not change public route names or navigation destinations as part of UI polish.
- Do not add API clients, API keys, backend packages, or authentication code during the UI phase.

### Styling rules

- Keep `src/index.css` as the primary shared stylesheet and preserve its existing visual direction.
- Reuse the existing CSS variables, typography pairing, dark dashboard palette, card treatment, spacing patterns, and positive/negative signal colors.
- Consolidate duplicate selectors when touching CSS; do not add layers of competing global overrides.
- Prefer scoped, component-specific class names that match the existing naming style.
- Do not replace the CSS approach with Tailwind, CSS modules, a component library, or an inline-style system unless explicitly requested.
- Do not redesign the brand, color system, typography, layout proportions, or navigation during this integration pass.
- Improve consistency by extracting repeated patterns, not by changing the product's visual identity.
- Any new responsive rule must preserve the current desktop layout and remain usable at 320px wide.

### Change discipline

- Make the smallest change that completes the current UI milestone.
- Preserve existing behavior unless the behavior is listed as incomplete in this document.
- Do not rewrite working pages just to use a new pattern; migrate repeated markup incrementally.
- Update this document when a structural or visual milestone changes.

## Current Baseline

- Repository: `ai-stock-prediction`
- Frontend: Vite + React + TypeScript
- Current branch: `main`
- Routes: implemented in `src/App.tsx`
- Shared shell: `src/layouts/MainLayout/MainLayout.tsx`
- Styling: primarily `src/index.css`
- Data layer: `src/data/mockData.ts` exists but is empty
- Domain types: `src/types/stock.ts` exists but is empty
- Automated tests: no test script currently exists

### Validation status

| Check | Status | Notes |
| --- | --- | --- |
| `npm run build` | Blocked | Unused `ArrowDown` imports in `src/pages/AIInsights/AIInsights.tsx` and `src/pages/StockDetails/StockDetails.tsx` fail TypeScript build. |
| `npm run lint` | Blocked | The same two unused imports fail ESLint. |
| Routes | Implemented | Includes fallback redirects and `/stock/:symbol`. |
| API integration | Not started | Correctly deferred until UI integration and polish are complete. |

## What Is Good

### Application structure

- The Vite, React, and TypeScript setup is present.
- The code is organized by components, layouts, pages, data, types, and assets.
- `BrowserRouter`, nested routes, a shared layout, and `<Outlet />` are configured.
- All planned primary routes exist:
  - `/dashboard`
  - `/markets`
  - `/stock/:symbol`
  - `/watchlist`
  - `/portfolio`
  - `/ai-insights`
  - `/news`
  - `/settings`
- Unknown routes redirect to `/dashboard`.

### Shared visual foundation

- `src/index.css` defines shared colors, surfaces, borders, typography, positive/negative signal colors, and common card styles.
- DM Sans and Space Grotesk provide a deliberate type pairing.
- The sidebar and header are shared through `MainLayout`.
- lucide-react icons are used consistently for navigation and controls.
- Desktop, tablet, and mobile breakpoints already exist.
- Existing page-specific empty feedback is present for filtered Watchlist and News results.

### Existing interactions

- Sidebar links use `NavLink` and display active navigation state.
- Markets gainers and losers navigate to `/stock/:symbol`.
- Stock search filters mock results and navigates to stock details.
- The root route redirects to Dashboard.
- Dashboard already composes Stock Search, Stock Overview, Stock Chart, AI Outlook, Technical Indicators, and News.

## What Is Missing or Incomplete

### Priority 0: restore the quality gate

- Remove the unused `ArrowDown` imports from:
  - `src/pages/AIInsights/AIInsights.tsx`
  - `src/pages/StockDetails/StockDetails.tsx`
- Re-run `npm run build` and `npm run lint` until both pass.

### Priority 1: shared UI primitives

The requested reusable component layer does not yet exist. Add these under a consistent location such as `src/components/ui/`:

- `Card`
- `StatCard`
- `Badge`
- `StockRow`
- `SectionHeader`
- `LoadingState`
- `EmptyState`
- `ErrorState`

Use these primitives to remove repeated `.ui-card`, heading, status, and row markup from pages. Keep the public props small and typed. Do not introduce a new state-management library for this pass.

### Priority 1: route-driven stock details

`/stock/:symbol` exists, but Stock Details currently renders Suzlon-specific content regardless of the URL. It must read `useParams()` and resolve the symbol from typed mock data. Unknown symbols need an explicit not-found state with a route back to Markets.

### Priority 1: cross-page navigation

Complete the visual product flow:

- Markets stock row -> Stock Details: partially working, but rows should be semantic links or keyboard-accessible controls.
- Watchlist stock row -> Stock Details: missing.
- Portfolio holding -> Stock Details: missing.
- Dashboard stock overview/search -> Stock Details: search works; overview actions are incomplete.
- News related-stock tag -> Stock Details: missing.
- AI Insights signal/prediction -> Stock Details: missing.
- Stock Details add/remove watchlist: missing.
- Header search should either navigate to the shared search flow or be clearly marked as a future control.

### Priority 1: state model

Every data-bearing page needs a consistent plan for these states before APIs are introduced:

- Loading: skeletons preserve the final layout dimensions.
- Empty: distinguish no data from no search/filter matches.
- Error: explain the failed operation and provide a retry action where retry is meaningful.
- Not found: especially for `/stock/:symbol`.
- Disabled/unavailable: use for controls that depend on a future backend capability.

The states should be reusable components, not one-off paragraphs embedded in each page.

### Priority 2: page-specific gaps

#### Dashboard

Present: welcome area, market status, search, stock overview, chart shell, AI outlook, technical overview, and news section.

Remaining: chart tooltip, volume visualization, working timeframe controls, stock statistics, market summary, latest-news extraction into a reusable panel, and loading/empty/error states.

#### Markets

Present: indices, top gainers, top losers, sector performance, and mock stock data.

Remaining: working `View all`, clear row affordance, keyboard access, loading/empty/error states, and a defined most-active list if it remains in the milestone.

#### Stock Details

Present: route, page composition, chart/technical/AI/news visual sections.

Remaining: route-driven data, unknown-symbol state, functional watchlist action, related-stock navigation, and responsive chart/table behavior.

#### Watchlist

Present: page layout, mock rows, filtering, and filtered empty feedback.

Remaining: add/remove behavior, persistence for the current session, stock-details navigation, distinction between an empty watchlist and zero filter results, and loading/error placeholders for the future API.

#### Portfolio

Present: portfolio summary, holdings, allocation, and mock presentation.

Remaining: holding navigation, functional portfolio actions, clear zero-holdings state, responsive table behavior, and data contracts for quantity, average price, current price, and P&L.

#### AI Insights

Present: AI-oriented visual sections and mock analysis content.

Remaining: stock navigation, working news-center action, explicit mock/unavailable labeling, loading/error states, and a typed prediction/explanation contract before connecting an AI service.

#### News

Present: News page, cards, filtering, and an empty result message.

Remaining: extract `NewsCard` and `NewsPanel` (currently empty files), make `Read` actionable, related-stock navigation, and loading/error states. News-to-stock mapping and sentiment remain backend/data work.

#### Settings

Present: Settings route and visual sections.

Remaining: persist settings, implement controls or clearly disable future-only controls, add form feedback, and define account/security boundaries for the backend phase.

## CSS and Visual Review

### Strengths

- Shared CSS variables make the visual direction recognizable.
- The dark intelligence-dashboard theme is coherent.
- Common card, spacing, status, and signal patterns are already visible across pages.
- Responsive rules cover several major grids, tables, and chart areas.

### CSS work remaining

- `src/index.css` has duplicated global selectors and page-specific overrides. Consolidate repeated rules before adding more features.
- Establish a small spacing, radius, typography, and control-size scale instead of relying on scattered values.
- Add visible `:focus-visible` states for links, buttons, inputs, rows, tabs, and chart controls.
- Verify contrast for muted text, active navigation, positive/negative colors, and disabled controls.
- Add consistent hover, pressed, disabled, and selected states.
- Define stable dimensions for chart panels, tables, badges, and icon buttons so dynamic content does not shift layout.
- Replace or remove unused Vite starter rules in `src/App.css`; `src/main.tsx` does not import that file.
- Avoid styling clickable behavior on plain `div` elements. Prefer `Link`/`NavLink` for navigation and `button` for actions.
- Check mobile access to AI Insights, News, and Settings. The current mobile navigation only exposes the primary navigation array, so intelligence and settings links can become unreachable.
- Test at 320px, 375px, 768px, 1024px, and desktop widths. Pay particular attention to the header search, tables, charts, cards, and bottom navigation.

## Recommended Implementation Order

1. Fix the two unused imports and make build/lint pass.
2. Add typed mock data and domain types for stocks, news, indicators, portfolio holdings, and predictions.
3. Add the shared UI primitives and state components.
4. Make Stock Details resolve `:symbol` and add not-found behavior.
5. Finish all stock navigation and watchlist interactions.
6. Extract reusable News card/panel components and complete News links.
7. Define page-level loading, empty, error, and disabled states using the shared primitives.
8. Consolidate CSS and complete focus, hover, responsive, and accessibility polish.
9. Run a manual route and viewport review, then add focused tests for routing, stock resolution, filtering, and state rendering.
10. Only after this checklist is complete, begin the Python/FastAPI and API data-flow phase.

## UI Definition of Done Before APIs

- All routes load without console errors.
- `npm run build` and `npm run lint` pass.
- Every visible navigation or action either works or is intentionally disabled with a clear reason.
- Every stock reference can reach Stock Details.
- Stock Details changes with the route symbol and handles unknown symbols.
- Empty, loading, error, and not-found states are defined for all data-bearing surfaces.
- Mobile users can reach every route and use every primary workflow.
- Keyboard focus and semantic controls are implemented for interactive elements.
- Shared primitives are used across pages instead of duplicating visual markup.
- Mock data and future API data can satisfy the same typed UI contracts.

## Backend Handoff Boundary

Do not add API keys or API packages during this UI phase. Once the UI definition of done is met, the planned flow is:

```text
Market API + Historical Data + News + Company Data
                         |
                         v
                    Python Backend
                         |
                         v
                    AI/Prediction Engine
                         |
                         v
                      React UI
```

The backend phase can then implement FastAPI structure, provider adapters, persistence, authentication, prediction services, AI integration, validation, rate limiting, and security hardening behind the contracts established by the UI.
