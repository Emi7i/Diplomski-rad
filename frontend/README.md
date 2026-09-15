# Frontend

The web UI for the Pi Control Portal — one page showing the Pi's live video feed, a console, and quick-action buttons. Needs the `backend/` service running alongside it (see the root `.env.example` and `CLAUDE.md`).

## Technologies Used

- **React 19** – UI library
- **TypeScript** – type safety
- **Vite** – build tool and dev server
- **Tailwind CSS v4** – utility-first styling
- **React Router v7** – single route (`/dashboard`)
- **Axios** – HTTP client
- **TanStack Query** – server-state management (fetches the command list)
- **Radix UI + class-variance-authority + clsx + tailwind-merge** – shadcn/ui component primitives
- **Lucide React** – icon library
- **`@xterm/xterm` + `@xterm/addon-fit`** – renders the live SSH console
- **`mpegts.js`** – plays the HTTP-FLV video stream

## Project Structure

```
frontend/
├── public/              # Static assets (favicon, icons)
├── src/
│   ├── assets/          # Images, fonts, etc.
│   ├── components/
│   │   ├── layout/      # Navbar, RootLayout
│   │   └── ui/          # shadcn/ui primitives
│   ├── features/
│   │   └── pi-control/  # video, console, command buttons — the whole app
│   ├── lib/              # api-client.ts (Axios), utils.ts (cn helper)
│   ├── pages/            # DashboardPage
│   ├── providers/        # AppProviders (TanStack Query)
│   ├── router/           # Route definitions
│   └── main.tsx           # Entry point
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
- **Feature-specific code** → `src/features/<feature>/`
  - `components/` – feature-specific React components
  - `hooks/` – feature-specific data hooks
  - `services/` – API calls for that feature
- **Route table** → `src/router/`
- **Providers** → `src/providers/`

### Path Aliases

Imports use aliases instead of relative paths, configured in `vite.config.ts` and `tsconfig.app.json`.

| Alias         | Points to            |
| ------------- | -------------------- |
| `@`           | `src/`               |
| `@lib`        | `src/lib/`           |
| `@components` | `src/components/`    |
| `@features`   | `src/features/`      |
| `@pages`      | `src/pages/`         |
| `@providers`  | `src/providers/`     |
| `@router`     | `src/router/`        |
| `@assets`     | `src/assets/`        |
| `@icons`      | `src/assets/icons/`  |
| `@images`     | `src/assets/images/` |

```ts
import { Button } from "@components/ui/button";
```

#### Adding a new alias

When adding a new top-level folder under `src/`, register it in **both** `vite.config.ts` and `tsconfig.app.json` files, then restart the dev server / TS server.

## Setup

1. From the repo root, copy `.env.example` to `.env` and fill in your Pi's details (see `CLAUDE.md`).
2. Install dependencies:

```bash
npm install
```

3. Start the development server (with `backend/` also running):

```bash
npm run dev
```

The app runs at the port set by `FRONTEND_URL` in the root `.env` (`http://localhost:5173` by default).

## Available Scripts

| Command           | Description                         |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Start Vite dev server               |
| `npm run build`   | Type-check and build for production |
| `npm run lint`    | Run ESLint                          |
| `npm run preview` | Preview production build locally    |
