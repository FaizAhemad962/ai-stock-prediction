# UI Data and API Audit

## Audit date

2026-09-03

## Scope

This audit checks every current React page and reusable component for hard-coded domain values and verifies whether the corresponding FastAPI endpoint is called through `src/services/api.ts`.

## Status Summary

| Category | Status |
| --- | --- |
| Backend mock endpoints | Present for the main UI domains |
| Frontend API client | Present in `src/services/api.ts` |
| Main quote, market, news, watchlist, portfolio, settings, auth, notification, and insights calls | Bound to the API client |
| Dashboard price chart | History endpoint is called; chart geometry is generated from returned points |
| Dashboard AI Outlook | Insights endpoint is called |
| AI Insights page | Expanded Insights endpoint supplies metrics, signals, factors, risks, news signals, and analysis |
| All displayed UI values are API-backed | Not yet; remaining gaps are documented below |
| Real external provider data | Not yet |
| Database-backed user data | Not yet |

## API-Backed UI Surfaces

These surfaces currently call `src/services/api.ts` and receive data from the FastAPI mock endpoints:

- Markets overview: `getMarketOverview()`
- Dashboard market status: `getDashboard()`
- Dashboard latest news: `getNews()`
- Dashboard featured stock: `getStock("SUZLON")`
- Dashboard technical indicators: `getStockTechnicals("SUZLON")`
- Dashboard price history: `getStockHistory("SUZLON", range)`
- Dashboard AI outlook: `getInsights("SUZLON")`
- Header stock search: `searchStocks()`
- Header profile: `getCurrentUser()`
- Header notifications: `getNotifications()` and `markNotificationRead()`
- Login: `login()`
- Register: `register()`
- Logout: `logout()`
- Google provider entry: `startGoogleAuth()`
- Stock Details quote/history/technicals/news: `getStock()`, `getStockHistory()`, `getStockTechnicals()`, `getStockNews()`
- News page: `getNews()`
- Watchlist: `getWatchlist()`, `addToWatchlist()`, `removeFromWatchlist()`
- Portfolio: `getPortfolio()`
- Settings preferences: `getPreferences()` and `updatePreferences()`
- AI Insights: `getInsights()`

## Hard-Coded or Partially Bound Findings

### 1. Dashboard Stock Overview

File: `src/components/StockOverview/StockOverview.tsx`

Status: Partially bound.

- The quote is fetched through `getStock("SUZLON")`.
- The featured symbol is hard-coded as `SUZLON`.
- The Dashboard has no selected-stock state, so this is a fixed featured-stock widget rather than a user-selected stock workflow.
- The watchlist action is API-backed through shared Watchlist context.

Required follow-up:

- Move the featured symbol into a Dashboard/view configuration or selected-stock state.
- Add a Dashboard endpoint or pass the selected symbol from the search/route workflow if the widget should change dynamically.

### 2. Dashboard Price Chart

File: `src/components/StockChart/StockChart.tsx`

Status: Partially bound.

- `getStockHistory("SUZLON", selectedRange)` is called.
- The SVG line is generated from returned price points.
- `SUZLON` and `Suzlon Energy` are hard-coded in the component.
- The chart footer labels `May 2026`, `Jun 2026`, `Jul 2026`, and `Aug 2026` are hard-coded and do not come from API timestamps.
- The endpoint currently returns the same mock points for every range, so range buttons make a request but do not yet produce distinct mock datasets.
- The chart does not yet show volume, tooltip values, or a data freshness label.

Required follow-up:

- Return symbol, company name, timestamps, and range-specific points from the API.
- Generate footer labels from returned timestamps.
- Add volume and tooltip data from the history response.
- Keep chart geometry derived from API points.

### 3. Dashboard AI Outlook

File: `src/components/AIOutlook/AIOutlook.tsx`

Status: Partially bound.

- `getInsights("SUZLON")` is called.
- Outlook, confidence, summary, and explanation come from the API response.
- `SUZLON` is hard-coded as the analyzed stock.
- The “View AI reasoning” button is still inactive.

Required follow-up:

- Add selected-stock or market-level insight semantics instead of a fixed symbol.
- Link “View AI reasoning” to the relevant AI Insights or Stock Details route.
- Return risks and supporting factors from the endpoint and render them here.

### 4. Dashboard Aggregate Endpoint

Files: `src/pages/Dashboard/Dashboard.tsx`, `backend/app/api/routes/dashboard.py`

Status: Partially used.

- Dashboard calls `getDashboard()` only for market status.
- The endpoint currently returns a `MarketOverviewResponse`, not a complete Dashboard response.
- Dashboard still makes separate news, quote, technicals, history, and insights calls.

Required follow-up:

- Either document `/api/dashboard` as a market-status shortcut or create a typed `DashboardResponse` containing all Dashboard sections.
- Avoid maintaining an endpoint that claims to aggregate Dashboard data but only returns market overview fields.

### 5. AI Insights Page

File: `src/pages/AIInsights/AIInsights.tsx`

Status: API-backed for the current mock phase.

- The page requests the expanded `/api/insights` response through `getInsights()`.
- Signal card names, prices, changes, outlook, and confidence come from the backend response.
- Market score, sentiment, summary, signal counts, risk counts, news count, and analysis timestamp come from the backend response.
- Reasoning factors, risks, risk levels, and news signals come from the backend response.
- Loading and error states use shared UI primitives.

Required follow-up:

- Replace the mock Insights provider with a validated prediction and AI service.
- Add request retry and freshness handling.
- Keep UI labels such as “Overall sentiment” and “Confidence” static; those are presentation labels, not domain data.

### 6. Stock Details Page

File: `src/pages/StockDetails/StockDetails.tsx`

Status: Partially bound.

- Quote, history, technicals, and related news are requested from APIs.
- Key statistics still come from the static `mockStockDetail` object.
- The AI outlook, confidence, explanation, technical momentum, sector momentum, and risk level are hard-coded.
- The selected chart labels and some chart geometry remain static.
- `mockStockDetail` is not keyed by symbol, so non-SUZLON routes can display Suzlon detail data.

Required follow-up:

- Add a stock details response containing quote, stats, history, technicals, prediction, explanation, and related news for the requested symbol.
- Remove `mockStockDetail` reads from the page once the endpoint exists.
- Render chart labels from API history timestamps.
- Add not-found behavior from the API response.

### 7. Portfolio Page

File: `src/pages/Portfolio/Portfolio.tsx`

Status: Partially bound.

- Holdings are fetched through `getPortfolio()`.
- Holdings rows are derived from API data.
- Total portfolio value, today P&L, overall P&L, allocation percentages, allocation colors, portfolio chart geometry, and chart labels remain hard-coded.
- `mockHoldings` is still used as an initial state fallback.
- Portfolio has no backend mutation endpoint for adding/editing/removing holdings.

Required follow-up:

- Return summary totals, allocation, and performance history from `/api/portfolio`.
- Remove the page-local allocation array.
- Add portfolio mutation contracts only when the UI action requirements are defined.
- Keep a clearly labeled loading state rather than showing stale mock holdings as if they were API data.

### 8. Watchlist Page

File: `src/pages/Watchlist/Watchlist.tsx`

Status: Partially bound.

- Watchlist symbols are loaded and mutated through the API.
- Stock names, prices, and changes are derived from centralized frontend `mockStocks`.
- AI signal mapping remains page-local.
- “Add stock” automatically adds the next available mock symbol rather than allowing a stock selected by the user.

Required follow-up:

- Add a backend watchlist response that includes stock display data and signal metadata, or fetch selected stock records through the API client.
- Add stock search/select behavior for Add stock.
- Move signal metadata to the backend insights contract when it becomes real data.

### 9. News Page

File: `src/pages/News/News.tsx`

Status: Mostly bound.

- News list, search query, category, and sentiment filters call `getNews()`.
- Articles and related symbols come from the API response.
- Article count `128`, trending topic names/counts, and the sentiment summary explanation remain hard-coded.
- Publisher URL behavior is currently represented by mock source URLs in `NewsCard`.

Required follow-up:

- Return summary counts and trending topics from the News API.
- Return article-specific URLs from the provider response.
- Add pagination metadata to the UI.

### 10. Settings Page

File: `src/pages/Settings/Settings.tsx`

Status: Partially bound.

- Notification, compact mode, and theme values load and update through the preferences API.
- Browser storage remains as a fallback.
- Market region, timezone, AI analysis frequency, active devices, and account/security values are static or deferred feedback.
- The page sends fixed values for market region, timezone, and AI frequency on every preference update.

Required follow-up:

- Add actual selectors/inputs for region, timezone, and AI frequency.
- Add typed account, security, privacy, and session endpoints.
- Replace browser-local persistence after authenticated sessions exist.

### 11. Header and Sidebar

Files: `src/components/Header/Header.tsx`, `src/components/Sidebar/Sidebar.tsx`

Status: Mixed.

- Profile identity and notifications use API data.
- Notification menu uses backend notification records.
- Exchange selection `NSE`/`BSE` is local state and is not passed to all data requests.
- Sidebar navigation labels and menu structure are intentionally static UI configuration.
- Logout calls the mock logout endpoint, but the backend does not invalidate a real session yet.

Required follow-up:

- Lift exchange selection into shared state and pass it to market/stock requests.
- Implement real session invalidation during authentication work.

## What Counts as Hard-Coded

These are acceptable static UI configuration values:

- Route paths.
- Navigation labels and icons.
- Form labels and placeholders.
- CSS colors, SVG gradient IDs, chart dimensions, and class names.
- Display labels such as “Price history”, “Today”, and “Confidence”.
- Mock fallback text that clearly says data is mock or unavailable.

These are not acceptable as final domain data:

- Prices, percentages, market scores, counts, dates, company names, symbols, portfolio totals, allocation percentages, news headlines, technical scores, AI factors, and prediction confidence values inside page/component files.

## Final Conclusion

The application is not fully free of hard-coded domain content yet. The main API binding exists and is working, but the Dashboard AI/portfolio summaries, Stock Details statistics and analysis, News summary widgets, Watchlist AI signals, and chart labels still need API-backed response fields.

The correct next step is not to replace every static string. It is to extend the relevant mock API response schemas first, move remaining domain records into the backend mock repository, then update `src/services/api.ts` and the affected UI components to consume those fields.
