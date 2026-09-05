# AI Stock Prediction UI Status

## Purpose

This document is the current frontend source of truth for the AI Stock Prediction application. It records what is implemented, what remains as UI polish, and how the frontend is bound to the FastAPI contracts.

The complete backend endpoint inventory and AI sequence are maintained in [docs/BACKEND-ROADMAP.md](BACKEND-ROADMAP.md). Use both documents together: this file describes UI behavior and the backend document describes the services required to power it.

The detailed hard-coded data and API binding audit is maintained in [docs/UI-DATA-AUDIT.md](UI-DATA-AUDIT.md). Use it before marking a UI surface fully API-backed.

The application uses Vite, React 19, TypeScript, React Router, lucide-react, and a typed frontend API client. Market, stock, history, technical, news, and rule-based prediction data are provider-backed; database persistence, production authentication, and AI-generated explanations are still pending.

### Data boundary

The frontend consumes backend responses through the contracts in `src/types/stock.ts`. Live market data uses the server-side provider adapter, while user-owned data requires PostgreSQL-backed sessions and repositories.

## Structure and Style Contract

The existing architecture and visual language are approved foundations. Future work must follow them rather than replace them.

### Code structure rules

- Keep the current Vite + React + TypeScript setup.
- Keep the existing route paths and `MainLayout`/`Outlet` architecture.
- Keep route-level screens under `src/pages/<PageName>/`.
- Keep reusable UI under `src/components/<ComponentName>/`.
- Keep shared layout code under `src/layouts/`.
- Keep shared contracts under `src/types/`; domain data must come through backend APIs.
- Add files only when they support an existing responsibility; do not reorganize the repository into a new architecture.
- Reuse React Router primitives, existing components, and lucide-react icons before introducing alternatives.
- Do not change public route names or navigation destinations as part of UI polish.
- Keep API access in `src/services/api.ts`; pages must not call external providers directly.
- Keep real provider keys, OpenAI keys, OAuth secrets, database credentials, and JWT secrets server-side.

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
- Data layer: the application uses the backend contract layer through `src/services/api.ts`; live market and news data are supplied by the server-side Yahoo Finance adapter.
- Domain types: stock, chart, indicator, news, portfolio, and prediction contracts are available in `src/types/stock.ts`
- Backend status: FastAPI routes for markets, stocks, history, technicals, news, and rule-based prediction use live provider data; user persistence and AI explanations remain pending.
- API audit: the main UI workflows use `src/services/api.ts`, including market, stocks, news, watchlist, portfolio, settings, auth, prediction, and insights.
- Data audit: market, stock, chart, technical, news, prediction, authentication, watchlist, portfolio, notifications, and preferences use backend APIs. User-owned flows require `DATABASE_URL` and the PostgreSQL schema.
- Automated verification: `npm run build`, `npm run lint`, and backend tests pass in the current milestone.

### Validation status

| Check | Status | Notes |
| --- | --- | --- |
| `npm run build` | Passing | Confirmed on 2026-09-03. |
| `npm run lint` | Passing | Confirmed on 2026-09-03. |
| Routes | Implemented | Includes dashboard routes, `/stock/:symbol`, `/login`, `/register`, and fallback redirects. |
| API integration | Live provider integration complete for market data | Main market, stock, chart, technical, news, and prediction surfaces use `src/services/api.ts`; user persistence and AI services remain pending. |

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
     - `/login`
     - `/register`
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
- Stock search queries the live backend provider and navigates to stock details.
- The root route redirects to Dashboard.
- Dashboard already composes Stock Search, Stock Overview, Stock Chart, AI Outlook, Technical Indicators, and News.
- Typed contracts cover stocks, price history, indicators, news, portfolio holdings, and predictions.
- Mock values are centralized in `src/data/mockData.ts`; UI components should not define duplicate stock records or provider-specific data shapes.
- Shared UI primitives now exist under `src/components/ui/` for cards, badges, section headers, stock rows, and common states.
- Stock Details now resolves `:symbol` and displays a not-found state for unsupported symbols.
- Watchlist, Portfolio, News, and AI Insights stock references now use semantic links to Stock Details.
- Watchlist state is shared across routes for the current session, with functional add, remove, and Stock Details toggle actions.
- Watchlist distinguishes an empty list from a search with no matching results.
- Mobile bottom navigation exposes Dashboard, Markets, Watchlist, Portfolio, AI Insights, and News; Settings is intentionally accessed through the Profile menu to avoid duplicate navigation.
- Stock Details now uses shared `StatCard` and `SectionHeader` primitives for statistics and news sections.
- Markets now uses `SectionHeader` and semantic keyboard-accessible links for stock rows.
- News article markup is now extracted into reusable `NewsCard` and `NewsPanel` components.
- Dashboard now uses a compact `NewsPanel` for latest stories instead of nesting the full News page.
- Header search now navigates supported symbols to Stock Details and reports unknown symbols.
- Header search now resolves exact company names through the centralized stock catalog.
- Watchlist and AI Insights now consume centralized `mockStocks` records instead of defining duplicate stock names and prices.
- Markets now consumes centralized typed records for indices, gainers, losers, and sectors.
- Portfolio now consumes typed holdings and calculates display P&L from numeric values.
- Stock Details now consumes centralized typed statistics, technical indicators, and related news records.
- News now consumes the centralized typed news feed for filtering and article rendering.
- Settings notification, compact-mode, and theme controls now have local session behavior with accessible pressed states.
- Settings notification, compact-mode, and theme preferences now persist across page reloads in browser storage.
- Settings remains partially complete: local preference behavior is implemented, while account, security, profile, market region, timezone, AI frequency, and real system-theme behavior remain unfinished.
- Shared loading, empty, and error primitives now have consistent styling, retry presentation, and keyboard focus treatment.
- A global `AppErrorBoundary` now provides a retryable render-error surface around the routed application.
- News and Watchlist now use the shared `EmptyState` primitive for filtered and empty-list results.
- Backend-dependent Settings actions now provide accessible deferred-action feedback instead of behaving like inactive buttons.
- Settings category navigation now scrolls to visible Account, Notifications, Appearance, Privacy & Security, and Data & AI sections with active-state feedback.
- Header Notifications now opens an in-place notification menu backed by the current development notification endpoint.
- Header Profile and the sidebar profile now open account menus with Account settings and Log out actions; the Sidebar no longer duplicates Settings as a separate navigation item.
- Header exchange indicator now opens an NSE/BSE selector with the selected exchange visible.
- Login and Register routes now provide email/password and Google provider entry points for the frontend flow.
- AI Insights now receives live-data-derived rule-based metrics, factors, risks, and prediction responses from `/api/insights`; AI-generated explanations are not enabled.
- Stock Details now requests public prediction data without login and renders outlook, confidence, uncertainty, summary, and risk count.
- A route-aware Product Tour now has dedicated targets for every Sidebar item, Profile/Settings, and the AI Insights page; it opens on first Dashboard visit and can be reopened from the Header Help control.

## What Is Missing or Incomplete

### Backend handoff status

Working: FastAPI app, CORS, `/health`, typed schemas, live provider routes for Markets, Stocks, History, Technicals, News, Predictions, and Insights, plus development endpoints for Watchlist, Portfolio, Notifications, Settings, and Authentication. The frontend API client binds all of these UI workflows.

Pending: PostgreSQL activation for password/session/privacy operations and portfolio mutations, portfolio performance history, production OAuth, request cancellation and retry refinement, richer per-symbol detail data, prediction calibration/monitoring, and AI explanation services. The visible UI controls, API contracts, and prediction evaluation endpoint are now wired and responsive. See [docs/BACKEND-ROADMAP.md](BACKEND-ROADMAP.md) for the complete endpoint inventory and integration audit.

### Priority 1: shared UI primitives

The shared component layer is now started under `src/components/ui/`:

- `Card`
- `StatCard`
- `Badge`
- `StockRow`
- `SectionHeader`
- `LoadingState`
- `EmptyState`
- `ErrorState`

The first migrations are complete in Stock Details and Markets. Continue migrating repeated page markup incrementally. The state primitives are styled and ready for page adoption; real loading/error lifecycle handling belongs at the future data-access boundary.

### Priority 1: route-driven stock details

`/stock/:symbol` now reads `useParams()` and resolves symbols through the live stock API. Unknown symbols show an explicit not-found state with a route back to Markets.

### Priority 1: cross-page navigation

Complete the visual product flow:

- Markets stock row -> Stock Details: working through semantic keyboard-accessible links.
- Watchlist stock row -> Stock Details: working for each stock row.
- Portfolio holding -> Stock Details: working for each holding.
- Dashboard stock overview/search -> Stock Details: search works; overview actions are incomplete.
- News related-stock tag -> Stock Details: working for each related symbol.
- AI Insights signal/prediction -> Stock Details: working for each signal card.
- Stock Details add/remove watchlist: working through shared session state.
- Header search -> Stock Details: working for supported symbols and exact company names, with an inline unknown-stock state.
- Header notification menu -> Settings Notifications: working.
- Header/sidebar profile menus -> Account settings: working; Log out is a visible pre-auth placeholder until authentication exists.
- Header exchange selector: working for local NSE/BSE selection; live exchange data remains future API work.
- Login/Register forms and Google provider buttons are UI-only until authentication and OAuth are connected in the backend phase.

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

Present: welcome area, market status, search, stock overview, chart shell, AI outlook, technical overview, and compact latest-news panel.

Remaining: volume visualization, dynamic chart footer labels, working timeframe metadata, and richer dashboard summary data.

#### Markets

Present: provider-backed indices, top gainers, top losers, and live market status.

Remaining: stale-data presentation, real-provider freshness behavior, and a defined most-active list if it remains in the milestone.

#### Stock Details

Present: route, page composition, chart/technical/AI/news visual sections.

Remaining: responsive chart/table behavior and broader per-symbol detail records.

#### Watchlist

Present: page layout, API-backed rows, filtering, and filtered empty feedback.

Remaining: backend mutation error feedback, stock catalog search for adding arbitrary symbols, and production user ownership/authentication.

#### Portfolio

Present: portfolio summary, holdings, allocation, and development-state presentation.

Remaining: functional portfolio mutation actions, clear zero-holdings state, responsive table behavior, and database-backed user ownership.

#### AI Insights

Present: live-data-derived rule-based signals and explicit non-AI explanation state.

Remaining: prediction evaluation, AI explanation provider behavior, request freshness/retry handling, and stronger uncertainty presentation.

#### News

Present: News page, cards, filtering, and an empty result message.

Remaining: richer pagination, provider-native sentiment classification, and article detail handling. The current `Read` action opens article-specific URLs returned by the live news provider.

#### Settings

Present: Settings route and visual sections.

Remaining:

- Make System theme apply the operating-system preference.
- Add typed controls for market region, timezone, and AI analysis frequency.
- Add clear save/sync feedback for preference changes.
- Replace browser-local persistence with authenticated user preferences.
- Connect profile editing, account security, privacy controls, and active devices.
- Connect real logout and session invalidation.

The Settings category navigation and local notification, compact-mode, and theme state are complete. Account-backed behavior belongs to the authentication and user-preferences API phase.

#### Onboarding

Present: a dismissible route-aware tour covering Dashboard, Markets, Watchlist, Portfolio, News, AI Insights, Settings, and responsible prediction interpretation. Completion is stored in browser storage, and the Help icon reopens the tour.

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
- Verify the six-item mobile navigation and Profile -> Account settings flow at 320px and 375px widths, including active states and tap targets.
- Test at 320px, 375px, 768px, 1024px, and desktop widths. Pay particular attention to the header search, tables, charts, cards, and bottom navigation.

## Recommended Implementation Order

1. Finish remaining visual-only mock sections using ready API response data.
2. Add request cancellation, retry refinement, and mutation error feedback.
3. Add provider reliability controls, freshness metadata, and contract monitoring.
4. Add database-backed user state, authentication, OAuth, and server-side logout.
5. Add production prediction evaluation and AI explanation safeguards.
6. Complete manual route and viewport review plus focused frontend/API tests.
7. Complete security, observability, deployment, and provider contract testing.

## UI and Mock API Integration Definition of Done

- All routes load without console errors.
- `npm run build` and `npm run lint` pass.
- Every visible navigation or action either works or is intentionally disabled with a clear reason.
- Every stock reference can reach Stock Details.
- Stock Details changes with the route symbol and handles unknown symbols.
- Empty, loading, error, and not-found states are defined for the current mock API request surfaces.
- Mobile users can reach every route and use every primary workflow.
- Keyboard focus and semantic controls are implemented for interactive elements.
- Shared primitives are used across pages instead of duplicating visual markup.
- Mock data and future API data can satisfy the same typed UI contracts.
- No stock price, company record, news record, or prediction should be hard-coded directly inside a page or reusable component.
- Settings UI and authentication actions must remain separate: visible controls may be implemented in the frontend, but identity, sessions, permissions, and account data must be enforced by the backend.

## Real Provider Handoff Boundary

The mock API-to-UI binding is complete. Real provider keys and external integrations must remain server-side. The planned flow is:

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
