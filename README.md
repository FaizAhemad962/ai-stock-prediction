
# AI Stock Prediction

AI Stock Prediction is a Vite + React + TypeScript frontend for market intelligence, stock details, watchlists, portfolio views, news, and AI-oriented insights.

## Current phase

The frontend UI foundation and mock API binding are complete enough for the next integration phase. The screens and routes use typed contracts through `src/services/api.ts`, and the next work is replacing mock providers with real backend providers one workflow at a time.

Backend work has started. The FastAPI foundation, complete typed mock API surface, and frontend API client binding are working. The next task is replacing remaining visual-only mock sections, then replacing mock providers with real market/news providers.

The UI is not yet production-complete: Settings has local preference behavior, but account, security, authenticated preferences, and real logout still require the backend. See the detailed UI and backend roadmaps before implementing those workflows.

The current code structure and visual language are fixed foundations for this phase. UI work must preserve the existing Vite/React/TypeScript architecture, route paths, page/component folders, `MainLayout` pattern, `src/index.css` styling system, typography, colors, and overall product identity. Improvements should be incremental and compatible with the existing structure.

Stock values shown during this phase are temporary mock data. Keep them centralized in `src/data/mockData.ts` and typed through `src/types/stock.ts`; do not duplicate stock records or hard-code prices inside page and component files. The future Python backend should return data compatible with these UI contracts.

## Run locally

```bash
npm install
npm run dev
```

Validation commands:

```bash
npm run build
npm run lint
```

## Routes

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

## Project structure

Login and Register screens are present for the frontend flow. Email/password submission and Google sign-in are currently UI placeholders; real sessions, OAuth credentials, password handling, and logout behavior belong to the authentication backend phase.


```text
src/
	components/   Shared UI components
	data/         Mock data, currently being formalized
	layouts/      Shared application shells
	pages/        Route-level screens
	types/        Shared TypeScript domain contracts
```

## Documentation

- [UI status and implementation roadmap](docs/UI-STATUS.md)
- [UI data and API binding audit](docs/UI-DATA-AUDIT.md)
- [Backend and AI roadmap](docs/BACKEND-ROADMAP.md)
- [Copilot project instructions](.github/copilot-instructions.md)

The UI status document is the source of truth for completed work, known gaps, CSS review items, acceptance criteria, and the handoff boundary for the later Python/API phase.

Backend endpoint status and pending API work are tracked in [BACKEND-ROADMAP.md](docs/BACKEND-ROADMAP.md).

The current mock API integration covers all core UI data workflows. Some routes are intentionally operational or contract-only: `/health` is for monitoring, the Google OAuth callback is provider-driven, and profile editing/session management await the authenticated account UI.

The backend foundation is in [backend](backend) and its implementation sequence is documented in [docs/BACKEND-ROADMAP.md](docs/BACKEND-ROADMAP.md). Python dependencies must be installed separately with `pip install -r backend/requirements.txt`.
