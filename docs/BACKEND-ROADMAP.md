# AI Stock Prediction Backend Roadmap

## Purpose

This document defines the backend and AI implementation path after the frontend UI handoff. The backend must serve stable, provider-independent contracts that match the existing React TypeScript models.

## Handoff Status

The frontend foundation is ready for backend work:

- Vite + React + TypeScript application is in place.
- Existing routes and `MainLayout` architecture are stable.
- Mock data is centralized in `src/data/mockData.ts`.
- UI contracts are defined in `src/types/stock.ts`.
- Login and Register screens exist as frontend flows.
- Watchlist, profile, notification, exchange, and stock navigation flows are defined.
- `npm run build` and `npm run lint` pass.

Before production release, complete a manual review at desktop, tablet, and 320px mobile widths.

## UI-to-API Coverage Matrix

Every current UI workflow has an intended backend boundary. Pages must consume these backend resources through a frontend data-access layer rather than calling providers directly.

| UI surface | Required backend capability | Planned resource |
| --- | --- | --- |
| Header search | Search symbols and company names | `GET /api/stocks/search?q=&exchange=` |
| Header exchange selector | Selected exchange and market session | `GET /api/markets/status?exchange=` |
| Dashboard | Combined market summary, featured quote, chart, indicators, AI outlook, and latest news | `GET /api/dashboard?exchange=` |
| Markets | Indices, gainers, losers, active stocks, and sectors | `GET /api/markets/overview?exchange=` |
| Stock Details | Quote and company profile | `GET /api/stocks/{symbol}?exchange=` |
| Stock Details chart | Historical OHLCV data and freshness | `GET /api/stocks/{symbol}/history?range=&exchange=` |
| Stock Details technicals | Calculated technical indicators | `GET /api/stocks/{symbol}/technicals?range=&exchange=` |
| Stock Details related news | News mapped to a stock | `GET /api/stocks/{symbol}/news?limit=` |
| Watchlist | User-owned list and mutations | `GET/POST/DELETE /api/watchlist` |
| Portfolio | User-owned holdings, valuation, P&L, and allocation | `GET /api/portfolio` |
| News | Search, category, sentiment, pagination, and article detail | `GET /api/news`, `GET /api/news/{article_id}` |
| AI Insights | Market signals, stock predictions, factors, risks, and explanations | `GET /api/insights`, `GET /api/stocks/{symbol}/prediction`, `GET /api/stocks/{symbol}/insights` |
| Notifications | User notifications, unread count, and read state | `GET /api/notifications`, `PATCH /api/notifications/{id}` |
| Settings | User preferences and account actions | `GET/PATCH /api/users/me/preferences`, `GET/PATCH /api/users/me` |
| Login/Register | Sessions, password auth, and Google OAuth | `/api/auth/*` |

This matrix is the completeness checklist for API planning. An endpoint is not complete until its schema, authentication rules, validation, error behavior, freshness requirements, and frontend loading/error states are defined.

## Non-Negotiable Boundaries

- Do not put provider API keys, OpenAI keys, OAuth secrets, database credentials, or JWT secrets in React code.
- Do not use `VITE_` variables for secrets; Vite variables are exposed to the browser.
- Keep provider calls in Python backend services.
- Keep the existing frontend routes, visual language, and TypeScript contracts unless a requirement explicitly changes them.
- Use adapters around external providers so changing a market or news provider does not require page rewrites.
- Return predictable JSON errors with an HTTP status, stable error code, and user-safe message.
- Validate all query parameters, symbols, dates, pagination values, and user-owned resources on the server.

## Recommended Architecture

```text
React UI
  |
  | HTTPS / JSON
  v
FastAPI application
  |
  +-- API routers
  +-- Authentication and authorization
  +-- Domain services
  +-- Provider adapters
  +-- Prediction service
  +-- AI explanation service
  +-- Database repositories
  +-- Validation, rate limits, and observability
```

Suggested backend layout:

```text
backend/
  app/
    main.py
    core/
    api/
    schemas/
    services/
    providers/
    repositories/
    models/
    tests/
  requirements.txt
  .env
```

The backend directory is a future addition. Do not reorganize the current frontend into this structure.

## Implementation Sequence

### 1. FastAPI foundation

- Create the Python backend separately from `src/`.
- Add health endpoint: `GET /health`.
- Configure CORS for known frontend origins.
- Add settings loaded from server-side environment variables.
- Add consistent error response schema.
- Add request IDs and structured server logging without secrets.

### 2. Contract layer

Define response schemas that map to the UI contracts:

- Stock quote and company data
- Historical price points
- Market indices and movers
- Sector performance
- Technical indicators
- News articles and sentiment
- Portfolio holdings
- Predictions and explanations

The frontend should consume backend responses through a data-access layer. Pages should not call external providers directly.

Common response metadata should include `timestamp`, `source`, `exchange`, and `is_stale` where applicable. Paginated resources should include `items`, `page`, `page_size`, and `total` or a cursor. Error responses should include a stable `code`, a safe `message`, and a request ID.

### 3. Market and company data

Recommended endpoints:

- `GET /api/markets/overview`
- `GET /api/markets/indices`
- `GET /api/markets/movers`
- `GET /api/markets/sectors`
- `GET /api/markets/status?exchange=`
- `GET /api/stocks/search?q=&exchange=`
- `GET /api/dashboard?exchange=`
- `GET /api/stocks/{symbol}`
- `GET /api/stocks/{symbol}/history`
- `GET /api/stocks/{symbol}/technicals`

Requirements:

- Support the selected exchange, initially NSE and BSE.
- Normalize provider symbols and currency values.
- Cache provider responses where appropriate.
- Return timestamps and data freshness metadata.
- Map provider failures to safe API errors.

### 4. Frontend data-access integration

- Add one frontend API client or service boundary after backend contracts are stable.
- Replace mock reads one workflow at a time.
- Preserve `LoadingState`, `EmptyState`, `ErrorState`, and not-found behavior.
- Add request cancellation and stale-request handling where needed.
- Keep mock mode available for local UI development.

Suggested order:

1. Markets overview
2. Stock Details quote/history/technicals
3. Dashboard summary
4. News
5. Watchlist
6. Portfolio
7. AI Insights

### 5. News pipeline

Recommended endpoints:

- `GET /api/news`
- `GET /api/news/{article_id}`
- `GET /api/stocks/{symbol}/news`

Additional requirements:

- Support search, category, sentiment, pagination, and source filtering.
- Support article-specific URLs and detail retrieval.
- Expose a stable article ID for notification, caching, and UI links.

Pipeline responsibilities:

- Fetch and normalize articles.
- Deduplicate stories.
- Map articles to stock symbols.
- Store article source URLs.
- Calculate or retrieve sentiment.
- Include publication time and freshness.
- Handle provider attribution and usage limits.

### 6. User features and authentication

Recommended endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/auth/google/start`
- `GET /api/auth/google/callback`
- `GET /api/watchlist`
- `POST /api/watchlist`
- `DELETE /api/watchlist/{symbol}`
- `GET /api/portfolio`
- `GET /api/notifications`
- `PATCH /api/notifications/{notification_id}`
- `GET /api/users/me`
- `PATCH /api/users/me`
- `GET /api/users/me/preferences`
- `PATCH /api/users/me/preferences`
- `GET /api/auth/sessions`
- `DELETE /api/auth/sessions/{session_id}`

Requirements:

- Hash passwords with a proven password-hashing library.
- Use secure, HttpOnly, SameSite cookies or a carefully designed token strategy.
- Authorize every user-owned watchlist and portfolio operation.
- Add account enumeration protections and rate limits to authentication endpoints.
- Never log passwords, tokens, OAuth codes, or provider secrets.
- Keep notification data user-scoped and support unread/read state.
- Keep preferences separate from account identity and validate allowed preference values.
- Support the Settings UI values for theme (`dark` or `system`), compact mode, notification preferences, market region, timezone, and AI analysis frequency.
- Logout must invalidate the current session server-side; redirecting to Login alone is not sufficient for production.
- Profile, privacy, security, and active-device controls must be protected by authentication and authorization.

### 7. Prediction engine

The prediction service should consume structured data, not raw UI strings:

```text
Historical prices
+ Technical indicators
+ Market context
+ Company data
+ Validated news signals
        |
        v
Prediction service
        |
        +-- outlook
        +-- confidence
        +-- uncertainty
        +-- factors
```

Recommended endpoint:

- `GET /api/stocks/{symbol}/prediction`

Requirements:

- Version the model and record the prediction timestamp.
- Return confidence and uncertainty separately.
- Validate data freshness and missing inputs.
- Never present predictions as guaranteed outcomes or financial advice.
- Add offline evaluation before exposing a model to users.

### 8. AI explanation layer

AI should explain structured prediction inputs and news context rather than independently inventing market data.

Recommended endpoint:

- `GET /api/stocks/{symbol}/insights`

The AI response should include:

- Summary
- Supporting factors
- Risks and counter-signals
- News impact
- Confidence context
- Timestamp and data sources

OpenAI or another provider must be called only from the Python backend. Add request timeouts, retry limits, response validation, usage limits, and redaction of sensitive user data.

### 9. Database and caching

Persist:

- Users and authentication identities
- Watchlist records
- Portfolio holdings
- News metadata and mappings
- Prediction metadata
- Audit events where required

Use migrations, indexes for symbol/time queries, ownership constraints, and retention rules. Cache read-heavy market data separately from user-owned records.

### 10. Security and production readiness

- Secret management outside source control.
- CORS allowlist.
- Authentication and authorization tests.
- Input validation and output schemas.
- Rate limiting for provider and AI calls.
- Secure headers and HTTPS deployment.
- Dependency and container scanning.
- Health and readiness checks.
- Monitoring for provider failures and latency.
- Backups and recovery plan.
- Privacy policy and data-retention decisions.

## Definition of Done Before Real Data

- Backend starts with documented setup commands.
- `GET /health` works.
- Contract schemas are tested.
- Provider adapters are isolated from API routers.
- Frontend can show loading, empty, error, and not-found states from real responses.
- No secret is exposed in the browser or committed to the repository.
- Market and Stock Details workflows work with one real provider.
- API failures and stale data are visible to users without leaking internals.

## Definition of Done Before AI

- Historical and market data is validated.
- News normalization and stock mapping work.
- Prediction output is versioned and evaluated.
- AI receives validated structured inputs.
- AI output is schema-validated and includes risks and uncertainty.
- Usage, cost, timeout, and failure handling are implemented.
- User-facing copy clearly distinguishes analysis from financial advice.
