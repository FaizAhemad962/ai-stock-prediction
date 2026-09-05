# AI Stock Prediction Backend

FastAPI backend for the AI Stock Prediction application. Market, stock, history, technical, news, and rule-based prediction data use server-side providers. User-owned data is persisted in PostgreSQL.

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

## PostgreSQL setup

Set `DATABASE_URL` in `backend/.env` before using authentication or user-owned endpoints:

```text
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/stock_prediction
```

Initialize the schema from the `backend` directory:

```bash
python scripts/init_db.py
```

Users, sessions, preferences, watchlists, portfolio holdings, and notifications are stored in PostgreSQL. The application does not seed or use in-memory user records.

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

The endpoint returns typed data from the server-side Yahoo Finance adapter.

## Endpoint inventory

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

Market and news endpoints use the live provider adapter. Authentication and user-owned endpoints require a PostgreSQL-backed bearer session. Prediction and insights are transparent rule-based signals; AI-generated explanations are not enabled. The React UI calls all endpoints through `src/services/api.ts`.

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
    models/        Persistence models and schema definitions
    providers/     External market/news/AI adapters
    repositories/  Data access boundaries
    schemas/       Request and response contracts
    services/      Domain and application services
    tests/         Backend tests
```

Do not place provider API keys in React or `VITE_` variables. Load secrets only in the backend runtime environment.
