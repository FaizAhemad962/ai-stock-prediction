
# AI Stock Prediction

AI Stock Prediction is a Vite + React + TypeScript frontend for market intelligence, stock details, watchlists, portfolio views, news, and AI-oriented insights.

## Current phase

The application is currently in the UI integration and polish phase. The screens and routes are present, but the interface still uses mock/static content. API and Python backend work is intentionally deferred until the frontend workflows, shared components, states, responsive behavior, and visual consistency are complete.

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

## Project structure

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
- [Copilot project instructions](.github/copilot-instructions.md)

The UI status document is the source of truth for completed work, known gaps, CSS review items, acceptance criteria, and the handoff boundary for the later Python/API phase.
