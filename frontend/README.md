# Frontend

A React + TypeScript + Vite frontend template.

## Technologies Used

- **React 19** – UI library
- **TypeScript** – type safety
- **Vite** – build tool and dev server
- **Tailwind CSS v4** – utility-first styling
- **React Router v7** – client-side routing
- **React Hook Form** – form handling
- **Zod** – schema validation
- **Axios** – HTTP client
- **TanStack Query** – server-state management (caching, syncing)
- **Zustand** – lightweight global state
- **Lucide React** – icon library
- **class-variance-authority + clsx + tailwind-merge** – component variant utilities

## Project Structure

```
frontend/
├── public/              # Static assets (favicon, icons)
├── src/
│   ├── assets/          # Images, fonts, etc.
│   ├── components/
│   │   ├── layout/      # Layout wrappers (e.g., ProtectedRoute)
│   │   ├── molecules/   # Small composed components
│   │   └── ui/          # Reusable base UI components
│   ├── config/          # App-level configuration (API URLs, env helpers)
│   ├── constants/       # Static constants and enums
│   ├── features/        # Domain-driven modules
│   ├── hooks/           # Shared custom React hooks
│   ├── lib/             # Utility libraries / third-party wrappers
│   ├── pages/           # Top-level route pages
│   ├── providers/       # Context / global providers (e.g., AppProviders)
│   ├── router/          # Route definitions
│   ├── security/        # Security-related utilities
│   ├── store/           # Zustand global stores
│   ├── types/           # Shared TypeScript types
│   ├── utils/           # General helper functions
│   ├── App.tsx          # Root component
│   └── main.tsx         # Entry point
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.app.json
└── tsconfig.node.json
```

### Where files should go

- **Pages** that match a route → `src/pages/`
- **Reusable UI primitives** (buttons, inputs) → `src/components/ui/`
- **Feature-specific code** (auth forms, cert lists) → `src/features/<feature>/`
  - `components/` – feature-specific React components
  - `hooks/` – feature-specific data hooks
  - `services/` – API calls for that feature
- **Shared hooks** → `src/hooks/`
- **Global state (Zustand)** → `src/store/`
- **Shared types** → `src/types/`
- **Config & constants** → `src/config/` and `src/constants/`
- **Route table** → `src/router/`
- **Providers** → `src/providers/`


### Path Aliases

Imports use aliases instead of relative paths, configured in `vite.config.ts` and `tsconfig.app.json`.

| Alias         | Points to         |
|---------------|-------------------|
| `@`           | `src/`            |
| `@lib`        | `src/lib/`        |
| `@components` | `src/components/` |
| `@features`   | `src/features/`   |
| `@pages`      | `src/pages/`      |
| `@providers`  | `src/providers/`  |
| `@router`     | `src/router/`     |
| `@constants`  | `src/constants/`  |
| `@assets`     | `src/assets/`     |
| `@icons`      | `src/assets/icons/` |
| `@images`     | `src/assets/images/` |
| `@store`      | `src/store/`      |

```ts
import { Button } from '@components/Button'
```

#### Adding a new alias

When adding a new top-level folder under `src/`, register it in **both** `vite.config.ts` and `tsconfig.app.json` files, then restart the dev server / TS server.


## Setup

1. Install dependencies:

```bash
npm install
```

If you ever need to reinstall the main libraries manually:

```bash
npm install react-router react-hook-form zod @hookform/resolvers axios @tanstack/react-query zustand class-variance-authority clsx tailwind-merge lucide-react
```

2. Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` by default.

## Mock users:

| Username             | Password      |
|----------------------|---------------|
| `test@example.com`   | password123   |
| `admin@example.com`  | admin123      |

You can find this implementation in [authService.ts](frontend/src/features/auth/services/authService.ts)

## Available Scripts

| Command        | Description                        |
|----------------|------------------------------------|
| `npm run dev`  | Start Vite dev server              |
| `npm run build`| Type-check and build for production|
| `npm run lint` | Run ESLint                         |
| `npm run preview` | Preview production build locally |


## Agents
There is also a CLAUDE.md file. Claude will pick up this automatically. <br>
If you're using a different AI coding tool, it likely won't pick up this by default. Please check what your AI tool uses.

- **Gemini CLI** — add this to `.gemini/settings.json`:
```json
  { "context": { "fileName": ["CLAUDE.md", "GEMINI.md"] } }
```
- **Other tools** (Codex, Cursor, etc.) — check whether they support pointing at a custom context filename, or copy the relevant sections into the tool's expected file.