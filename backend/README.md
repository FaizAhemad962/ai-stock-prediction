# AI Stock Prediction Backend

FastAPI backend for the AI Stock Prediction application. This service is intentionally provider-independent: market, news, authentication, prediction, and AI integrations should be added behind the documented service and provider boundaries.

## Local setup

From the repository root:

```bash
python -m venv .venv
.venv\\Scripts\\activate
pip install -r backend/requirements.txt
uvicorn backend.app.main:app --reload
```

If you are already inside the `backend` directory, use:

```bash
uvicorn app.main:app --reload
```

Both commands start the same application. The package-relative imports support either working directory.

The API is available at `http://127.0.0.1:8000`.

## First endpoint

```text
GET /health
```

The interactive API documentation is available at `/docs` while the server is running.

## Market overview endpoint

```text
GET /api/markets/overview?exchange=NSE
GET /api/markets/overview?exchange=BSE
```

The mock implementation returns typed data for the current UI contracts. External market providers will be added behind the provider boundary later.

## Mock endpoint inventory

| Area | Endpoints |
| --- | --- |
| System | `GET /health` |
| Markets | `GET /api/markets/overview`, `GET /api/dashboard` |
| Stocks | `GET /api/stocks/search`, `GET /api/stocks/{symbol}`, `GET /api/stocks/{symbol}/history`, `GET /api/stocks/{symbol}/technicals` |
| News | `GET /api/news`, `GET /api/news/{article_id}`, `GET /api/news/stock/{symbol}` |
| User | `GET/PATCH /api/users/me`, `GET/PATCH /api/users/me/preferences` |
| Notifications | `GET /api/notifications`, `PATCH /api/notifications/{notification_id}` |
| Watchlist | `GET/POST /api/watchlist`, `DELETE /api/watchlist/{symbol}` |
| Portfolio | `GET /api/portfolio` |
| Authentication | `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`, `GET /api/auth/google/start`, `GET /api/auth/google/callback` |
| AI | `GET /api/insights`, `GET /api/stocks/{symbol}/prediction`, `GET /api/stocks/{symbol}/insights` |

All endpoints currently use in-memory mock records. They are contracts and development fixtures, not production authentication, market data, persistence, prediction, or AI behavior. The React UI calls them through `src/services/api.ts`.

Run tests from inside `backend` with:

```bash
python -m pytest tests -q
```

## Structure

```text
backend/
  app/
    api/           FastAPI routers and route handlers
    core/          Settings and cross-cutting concerns
    models/        Persistence models, added with the database phase
    providers/     External market/news/AI adapters
    repositories/  Data access boundaries
    schemas/       Request and response contracts
    services/      Domain and application services
    tests/         Backend tests
```

Do not place provider API keys in React or `VITE_` variables. Load secrets only in the backend runtime environment.
