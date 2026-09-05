# UI Data and API Audit

## Audit date

2026-09-05

## Scope

This audit checks every current React page and reusable component for hard-coded domain values and verifies whether the corresponding FastAPI endpoint is called through `src/services/api.ts`.

## Status Summary

| Category | Status |
| --- | --- |
| Backend provider endpoints | Live market, stock, history, technical, news, and rule-based prediction routes are present |
| Frontend API client | Present in `src/services/api.ts` |
| Main quote, market, news, watchlist, portfolio, settings, auth, notification, and insights calls | Bound to the API client |
| Dashboard price chart | History endpoint is called; chart geometry is generated from returned points |
| Dashboard AI Outlook | Insights endpoint is called |
| AI Insights page | Insights endpoint supplies live-data-derived metrics, signals, factors, risks, news signals, and analysis |
| Public Stock Details prediction | Prediction endpoint supplies current price, outlook, confidence, uncertainty, summary, and risks without login |
| All displayed UI values are API-backed | Not yet; fixed featured-stock and portfolio presentation defaults remain |
| Real external provider data | Yes for market, stock, history, technical, news, and rule-based prediction flows |
| Database-backed user data | Not yet |

## API-Backed UI Surfaces

These surfaces currently call `src/services/api.ts` and receive data from the FastAPI endpoints. Market-data endpoints use the server-side Yahoo Finance adapter; user-owned endpoints remain development-state until persistence is added:

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
- Chart footer labels are generated from API timestamps.
- The endpoint now returns live range-specific points; the chart still lacks volume, tooltips, and a freshness label.
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

Status: API-backed with live-data-derived rule-based signals; AI-generated explanations are not enabled.

- The page requests the expanded `/api/insights` response through `getInsights()`.
- Signal card names, prices, changes, outlook, and confidence come from the backend response.
- Market score, sentiment, summary, signal counts, risk counts, news count, and analysis timestamp come from the backend response.
- Reasoning factors, risks, risk levels, and news signals come from the backend response.
- Loading and error states use shared UI primitives.

Required follow-up:

- Prediction evaluation is now available through the backend; calibration, monitoring, and AI explanation service remain pending.
- Add request retry and freshness handling.
- Keep UI labels such as “Overall sentiment” and “Confidence” static; those are presentation labels, not domain data.

### 6. Stock Details Page

File: `src/pages/StockDetails/StockDetails.tsx`

Status: Partially bound.

- Quote, history, technicals, and related news are requested from APIs.
- Some secondary statistics still come from the static `mockStockDetail` object.
- Prediction outlook, confidence, explanation, and risks come from the live-data-derived prediction endpoint; some presentation labels remain static.
- The selected chart labels and some chart geometry remain static.
- `mockStockDetail` remains a legacy source for secondary fields and is not keyed by symbol.

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
- Allocation percentages and stock count are derived from API holdings; portfolio chart geometry and performance labels remain static until a performance-history endpoint exists.
- Portfolio period controls and the Manage action now respond in the UI; add/remove holding API contracts are implemented and require the approved persistence store.

Required follow-up:

- Return summary totals, allocation, and performance history from `/api/portfolio` once portfolio persistence is implemented.
- Remove the page-local allocation array.
- Activate persistence and add performance-history data for the portfolio period controls.
- Keep a clearly labeled loading state rather than showing stale mock holdings as if they were API data.

### 8. Watchlist Page

File: `src/pages/Watchlist/Watchlist.tsx`

Status: Partially bound.

- Watchlist symbols are loaded and mutated through the API.
- Stock names, prices, and changes are derived from market API responses.
- Signals are derived from live quote movement.
- Add stock now searches the backend stock API before adding a selected symbol.

Required follow-up:

- Add a backend watchlist response that includes stock display data and signal metadata, or fetch selected stock records through the API client.
- Add stock search/select behavior for Add stock.
- Move signal metadata to the backend insights contract when it becomes real data.

### 9. News Page

File: `src/pages/News/News.tsx`

Status: Mostly bound.

- News list, search query, category, and sentiment filters call `getNews()`.
- Articles and related symbols come from the API response.
- Article count and sentiment score are derived from the returned articles, and pagination uses the API page/total metadata; trending topics remain pending.
- Read actions use article URLs returned by the provider.

Required follow-up:

- Return summary counts and trending topics from the News API.
- Return article-specific URLs from the provider response.
- Add backend-provided trending topics when the provider contract supports them.

### 10. Settings Page

File: `src/pages/Settings/Settings.tsx`

Status: Partially bound.

- Notification, compact mode, and theme values load and update through the preferences API.
- Browser storage remains as a fallback.
- Market region, timezone, and AI analysis frequency now have working controls and are sent through the preferences API.
- Password, privacy, and active-device panels call explicit account-service contracts; password/session operations remain unavailable until PostgreSQL is activated.

Required follow-up:

- Add backend persistence and validation for region, timezone, and AI frequency in every environment.
- Activate and harden the account, security, privacy, and session endpoints against the production database.
- Replace browser-local persistence after authenticated sessions exist.

### 10a. Profile and Account Checklist

The Profile menu currently opens Settings, but the account surface is not complete. These items are pending before Profile can be considered finished:

- Load the signed-in user's name, email, avatar, and account status in Header, Sidebar, and Settings.
- Implement editable name and email fields with validation, save, cancel, and success/error feedback.
- Add password change with current-password verification, confirmation, and session invalidation rules.
- Add real logout state handling and redirect behavior for expired or revoked sessions.
- Add active-session/device listing, revoke-one-session, and revoke-all-other-sessions actions.
- Add privacy controls for analytics, personalization, and data retention.
- Add account export and account deletion flows with confirmation and backend status feedback.
- Add region, timezone, and AI-frequency controls that persist through the preferences contract.
- Add profile avatar upload or a deliberate initials/avatar fallback based on the user record.
- Add authenticated route behavior so account-owned screens explain when the user is signed out.

### 11. Header and Sidebar

Files: `src/components/Header/Header.tsx`, `src/components/Sidebar/Sidebar.tsx`

Status: Mixed.

- Profile identity and notifications use API data.
- Notification menu uses backend notification records.
- Exchange selection `NSE`/`BSE` is local state and is not passed to all data requests.
- Sidebar navigation labels and menu structure are intentionally static UI configuration.
- Logout currently depends on the staged authentication contract; the UI needs expired-session and revoked-session handling.

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

The application is not fully free of hard-coded domain content yet. The main API binding exists and is working, but the Dashboard AI/portfolio summaries, Stock Details statistics and analysis, News summary widgets, Watchlist signals, and chart labels still need API-backed response fields. Profile and Settings also require a complete account workflow.

The next product step is to finish the UI contracts and workflows first: complete Profile/Settings, portfolio actions, chart metadata, news summaries, and account states. The PostgreSQL schema and repository are staged under `backend/sql/` and `backend/app/repositories/`, but database activation should wait until the full contract and UI behavior are approved.
