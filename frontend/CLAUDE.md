## Stack
- Framework: Vite + React + TypeScript
- Styling: Tailwind CSS v4 (new syntax only) + shadcn/ui
- Routing: React Router v7, with role-based protected routes
- Forms: React Hook Form + Zod
- HTTP: Axios — single instance with auth interceptors
- Server state: TanStack Query
- Global state: Zustand

## Folder structure
- `src/features/` — domain logic (auth, passwords, certificates), each with `components/`, `hooks/`, `services/`
- `src/components/` — shared UI: `ui/` (atoms), `molecules/`, `layout/`
- `src/pages/` — page-level components
- `src/store/` — Zustand stores (`authStore.ts`, `vaultStore.ts`)
- `src/lib/` — Axios instance (`api-client.ts`) and Zod schemas (`schemas.ts`)
- `src/security/` — Web Crypto logic
- `src/types/` — global TypeScript interfaces

## Rules
- Import via path aliases (`@features`, `@components`, `@lib`, etc.), never relative paths like `../../lib`.
- Never suggest Redux, Next.js, plain `fetch`, class components, or any crypto library — Web Crypto API only.
- Prefer shadcn/ui components over custom-built ones when a suitable one exists.
- Use Tailwind v4 syntax only (e.g. `@theme` in CSS, not `tailwind.config.js`).
- If a request can't be solved cleanly within this stack, say so before proposing alternatives.
- Follow language/framework best practices, and ask a clarifying question before proceeding if anything is ambiguous or underspecified.

## Aliases
| Alias | Path |
|---|---|
| `@` | `src/` |
| `@features` | `src/features/` |
| `@components` | `src/components/` |
| `@pages` | `src/pages/` |
| `@providers` | `src/providers/` |
| `@router` | `src/router/` |
| `@constants` | `src/constants/` |
| `@store` | `src/store/` |
| `@lib` | `src/lib/` |
| `@security` | `src/security/` |
| `@types` | `src/types/` |
| `@assets` | `src/assets/` |
| `@icons` | `src/assets/icons/` |
| `@images` | `src/assets/images/` |
