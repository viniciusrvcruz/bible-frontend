# AGENTS.md — Bibleasy Frontend

Guidance for AI coding agents and contributors working on this codebase. Follow these conventions so new work stays consistent with existing patterns.

## Deep-dive docs

Domain-specific guides (Portuguese prose, English filenames) live under **[`docs/`](./docs/README.md)** — **`core/`** (HTTP, shell, UI, SEO) vs **`domains/`** (bible, home, help) vs **`testing/`**. Start at [`docs/domains/bible/overview.md`](./docs/domains/bible/overview.md) for reader work, or [`docs/core/`](./docs/core/) for shared app infrastructure.

## Product context

- **Bibleasy** (`bibleasy-frontend` in `package.json`) is a **Nuxt 4** web app for reading the Bible online.
- **Production:** [https://bibleasy.com](https://bibleasy.com)
- **Backend API:** [bibleasy-backend](https://github.com/viniciusrvcruz/bibleasy-backend) — this frontend consumes its REST API; local dev requires a running backend and valid env vars.
- **Primary locale for copy and SEO** is **pt-BR** (UI strings, meta descriptions, schema.org). Technical docs and this file are in **English** by convention for tooling.
- **Code comments** must be in **English**.

## Tech stack

| Area | Choice |
|------|--------|
| Framework | [Nuxt 4](https://nuxt.com/) (Vue 3, `<script setup>`, Composition API) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (Vite plugin), [DaisyUI](https://daisyui.com/) themes |
| Components | PrimeVue (Aura preset via `@primeuix/themes`), local Vue SFCs |
| State | Pinia (`@pinia/nuxt`) |
| HTTP | `$fetch` wrapper (`app/plugins/api.ts`) exposed as `useNuxtApp().$api` |
| Validation / API shapes | Zod (`zod` v4) |
| Icons | `@nuxt/icon` — registered component name **`NuxtIcon`**; prefer semantic **`Icon`** wrapper (`app/components/Icon.vue`) |
| SEO | `@nuxtjs/seo`, PWA (`@vite-pwa/nuxt`), analytics (`nuxt-gtag`, `nuxt-clarity-analytics`) |
| Testing | [Vitest](https://vitest.dev/) + [`@nuxt/test-utils`](https://nuxt.com/docs/getting-started/testing) (unit, Nuxt runtime, e2e) |

There is **no ESLint config** in-repo at the time of writing; rely on TypeScript and match surrounding style.

## Local development

**Prefer Docker** for installing dependencies, running scripts, and verifying builds. The project ships with **`docker-compose.yml`** (service **`bible_frontend`**, container name **`bible_frontend`**, Node 24, port **3000**). Agents should run npm/nuxt commands **inside the container** unless Docker is unavailable or the user explicitly asks for a host install.

### Docker workflow (preferred)

```bash
cp .env.example .env   # NUXT_API_BASE_URL=http://bible_api:8080 when backend runs on bible_network

docker compose up -d

# One-off commands (preferred pattern for agents)
docker compose exec bible_frontend npm install
docker compose exec bible_frontend npm run dev      # http://localhost:3000

# Interactive shell when needed
docker compose exec bible_frontend bash
```

| Command (inside container) | Purpose |
|----------------------------|---------|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npx nuxt typecheck` | TypeScript check (runs in CI) |
| `npm test` | Run all Vitest projects (unit, nuxt, e2e) |
| `npm run test:unit` | Pure unit tests only (Node, fast) |
| `npm run test:nuxt` | Tests that need the Nuxt runtime (DOM, auto-imports) |
| `npm run test:e2e` | End-to-end tests via `@nuxt/test-utils/e2e` |
| `npm run test:watch` | Vitest watch mode |

**Env in Docker:** set **`NUXT_PUBLIC_API_BASE_URL`** to a URL reachable from the browser (e.g. `http://localhost:8080`). Set **`NUXT_API_BASE_URL`** to the backend hostname on **`bible_network`** (e.g. `http://bible_api:8080`) for SSR/server-side `$api` calls.

**Before opening a PR:** run typecheck, tests, and build **in the container** (mirrors CI):

```bash
docker compose exec bible_frontend npx nuxt typecheck
docker compose exec bible_frontend npm test
docker compose exec bible_frontend npm run build
```

### Host fallback (only when Docker is not an option)

Node.js 20+ and npm on the host — same scripts as above, without `docker compose exec`.

## Repository layout

```
app/
  assets/css/main.css    # Tailwind entry + DaisyUI + shared @utility rules
  components/            # Vue SFCs grouped by domain (see below)
  composables/           # Shared composition logic (+ bible/, services/)
  data/                  # Static TS data (e.g. verse of the day)
  layouts/default.vue    # Shell: versions/books bootstrap, header, modals
  pages/                 # File-based routes
  plugins/               # Nuxt plugins (*.client.ts where needed)
  stores/                # Pinia stores (defineStore)
  types/<entity>/        # Zod schemas (*.schema.ts) + inferred types (*.type.ts)
  utils/                 # env parsing, errors, helpers, bible/* book metadata
  app.vue                # Root: NuxtLayout + NuxtPage
server/
  api/                   # Nitro routes (e.g. sitemap URL source)
test/
  unit/                  # Pure logic (Node env) — mirrors app/ (utils/, composables/, …)
  nuxt/                  # Nuxt runtime (happy-dom) — mirrors app/ for DOM, components, composables
  e2e/                   # Full app via @nuxt/test-utils/e2e — SSR, Nitro routes
vitest.config.ts         # Vitest projects (unit / nuxt / e2e)
.env.test                # Env vars loaded during Vitest runs
nuxt.config.ts           # Modules, runtimeConfig, SEO, PWA, PrimeVue, color-mode
```

### `components/` grouping

Use the same buckets when adding UI:

- **`bible/`** — Reader: chapter view, verse selector, search, modals tied to reading.
- **`home/`** — Marketing / landing sections.
- **`help/`** — Help center, FAQ, support forms.
- **`layout/header/`** — Global chrome (theme, user/help menus).
- **`shared/`** — Cross-cutting small widgets (e.g. social links).

Nested folders often expose a **folder component** via `index.vue` (e.g. `bible/chapter/index.vue` registers as **`BibleChapter`** in templates).

### Pages and routes

| Route | File | Role |
|-------|------|------|
| `/` | `pages/index.vue` | Landing / home |
| `/bible` | `pages/bible/index.vue` | Bible entry redirect |
| `/bible/[reference]` | `pages/bible/[reference]/index.vue` | Chapter reader (e.g. `gn.1`) |
| `/help` | `pages/help/index.vue` | Help center |

Bible reader URLs encode **book + chapter** (and optionally version) — see **`useBibleReference`** and **`useNavigateToBible`**. Keep **`server/api/__sitemap__/urls.ts`** in sync when URL patterns change.

## Naming conventions

- **Files**: `useSomething.ts` composables; `somethingStore.ts` stores; `Something.vue` or `index.vue` inside a PascalCase-friendly path for components.
- **Pinia**: store ids like `'version'`; usage **`useVersionStore()`** (auto-imported from `stores/versionStore.ts`).
- **API path helpers**: **`useChapterService`**, **`useBookService`**, etc. — factories returning **`useShow`**, **`useIndex`**, etc., built on **`useApiFetch`** / **`useApi`**.
- **REST path segments** in composables: mirror backend resources (e.g. `versions/${version_id}/books/${book}/chapters/${chapter}`) — note **`version_id`** snake_case when matching API fields.
- **Commits / branches**: Conventional Commits in English (`feat:`, `fix:`, `refactor:`, …).

## Data fetching

1. **Declarative SSR/data** — Prefer **`useApiFetch<T>(url)`** (`app/composables/useApiFetch.ts`): wraps `useFetch` with **`key: url`** and **`$fetch: useNuxtApp().$api`**. Use this from pages/services for GETs that should participate in SSR and dedupe.

2. **Imperative JSON/Form calls** — **`useApi()`** (`app/composables/useApi.ts`): typed **`get` / `post` / `put` / `del`** on the same `$api` instance. Use for mutations, lazy loads, or non-SSR requests.

3. **API base URL** — Plugin sets **`baseURL`** to **`${runtimeConfig.apiBaseUrl}/api/`** on server and **`${public.apiBaseUrl}/api/`** on client (`app/plugins/api.ts`). Server requests attach **`X-Api-Key`** from **`runtimeConfig.apiKey`** (never expose the key to the client).

4. **Bootstrap** — Global versions/books loading lives in **`layouts/default.vue`**; chapter route **`pages/bible/[reference]/index.vue`** loads chapter data and coordinates stores.

### API services (`composables/services/`)

| Service | Typical methods | Resource |
|---------|-----------------|----------|
| `useVersionService` | `useIndex` | `versions` |
| `useBookService` | `useIndex(version_id)` | `versions/{id}/books` |
| `useChapterService` | `useShow(book, chapter, version_id)` | chapter payload |
| `useVerseHighlightService` | CRUD helpers | verse highlights |
| `useSupportService` | form submit | support tickets |

Add new backend resources here — export path builders (e.g. `chapterResourcePath`) when reused.

### Pinia stores (`stores/`)

| Store | Responsibility |
|-------|----------------|
| `useVersionStore` | Selected version, books list, version switching |
| `useLastChapterStore` | Persist last-read chapter reference |

### Bible composables (`composables/bible/`)

Reader-specific logic: `useBibleReference`, `useNavigateToBible`, `useChapterHistory`, `useSelectedVerses`, `useVerseHighlights`, `useVerseFocus`, `useProcessedVerseParts`, `useBibleFullscreen`, `useVerseOfTheDay`.

## Types and validation

- Per entity under **`app/types/<name>/`**:
  - **`*Schema.ts`** — Zod schemas (export `somethingSchema`).
  - **`*type.ts`** — `export type Something = z.infer<typeof somethingSchema>` (and related inferred types).
- Reuse schemas across nested objects (e.g. `chapterSchema` imports `bookSchema`, `verseSchema`).
- Bible book enums/metadata live in **`app/utils/bible/book.ts`** — use them for routing and sitemap generation, not ad-hoc strings.

## Errors

- Use **`createAppError(message, statusCode?)`** from **`app/utils/errors.ts`** for user-facing failures (wraps Nuxt **`createError`**; **`fatal`** is tied to client).

## Testing

Tests use **Vitest** with three projects defined in **`vitest.config.ts`** (see [Nuxt testing docs](https://nuxt.com/docs/getting-started/testing)):

| Project | Directory | Environment | Use for |
|---------|-----------|-------------|---------|
| `unit` | `test/unit/` | Node | Pure functions, Zod schemas, book metadata — no Nuxt auto-imports |
| `nuxt` | `test/nuxt/` | Nuxt + happy-dom | Components, composables, DOM helpers — use `mountSuspended`, `mockNuxtImport`, `registerEndpoint` |
| `e2e` | `test/e2e/` | Node + Nuxt server | SSR pages, Nitro routes — use `$fetch` and `setup()` from `@nuxt/test-utils/e2e` |

**Conventions:**

- File pattern: `*.test.ts` or `*.spec.ts` under `test/<project>/`, **mirroring `app/`** (e.g. `app/utils/bible/book.ts` → `test/unit/utils/bible/book.test.ts`).
- **`test/nuxt/`** files get Nuxt TypeScript context (`~/`, auto-imports). **`test/unit/`** imports source via `~/` alias configured in Vitest — do not rely on Nuxt runtime features there.
- **`@nuxt/test-utils/runtime`** and **`@nuxt/test-utils/e2e`** must not be mixed in the same file.
- Env for tests: **`.env.test`** (committed — fake values only; loaded automatically by Vitest). CI may override with GitHub secrets when set.
- E2e tests that hit pages with API bootstrap (e.g. **`layouts/default.vue`**) need a reachable backend or mocks. Prefer **unit tests** for Nitro route logic (see **`app/utils/bible/sitemapUrls.ts`**) — full **`@nuxt/test-utils/e2e`** `setup()` rebuilds the app and is slow (~45s+); reserve e2e for true SSR/page or browser flows.

**Helpers (Nuxt runtime tests):**

- **`mountSuspended`** — mount Vue components with Nuxt context (`@nuxt/test-utils/runtime`).
- **`mockNuxtImport`** / **`mockComponent`** — mock auto-imports and components.
- **`registerEndpoint`** — mock Nitro endpoints for component data fetching.

**CI:** `.github/workflows/ci.yml` runs `npm test` after typecheck and before build.

## Environment

- **`app/utils/env.ts`** parses **`import.meta.env`** with Zod (`NUXT_PUBLIC_API_BASE_URL`, `NUXT_API_KEY`, etc.).
- **`nuxt.config.ts`** reads **`env`** for **`runtimeConfig`** — keep new secrets/public vars consistent with that pattern.

| Variable | Client | Server | Notes |
|----------|--------|--------|-------|
| `NUXT_PUBLIC_API_BASE_URL` | ✓ | fallback | Browser API base |
| `NUXT_API_BASE_URL` | — | ✓ | SSR/internal (Docker hostnames) |
| `NUXT_API_KEY` | — | ✓ | `X-Api-Key` header |
| `NUXT_PUBLIC_DEFAULT_VERSION_ABBREVIATION` | ✓ | — | Optional default version |

## Styling and theming

- Global styles: **`app/assets/css/main.css`** — `@import "tailwindcss"`, DaisyUI `@plugin`, CSS variables (e.g. **`--h-header`**), **`@utility`** helpers (`h-header`, `top-header`, `h-screen-header`), **`color-scheme`** rules per DaisyUI theme.
- Prefer **DaisyUI semantic classes** (`bg-base-100`, `btn`, etc.) and Tailwind utilities already used nearby.
- **Color mode**: `@nuxtjs/color-mode` with cookie storage key **`theme`** (`dataValue: 'theme'`). Theme list UI: **`ThemeSelectorPopover.vue`**.
- **PrimeVue**: use for complex widgets (dialogs, inputs) where DaisyUI alone is insufficient; Aura preset is configured globally — avoid overriding theme tokens without reason.

## Icons

- Use **`Icon`** with semantic keys (`icon="search"`, `icon="book_open"`) — maps to Iconify collections in **`Icon.vue`**.
- Add new icons to **`ICON_MAP`** in `Icon.vue`; do not scatter raw Iconify strings across templates.

## Plugins

- **`app/plugins/api.ts`** — shared `$api` instance (always loaded).
- **`app/plugins/theme-color.client.ts`** — client-only theme-color meta updates (suffix **`.client.ts`** for browser-only code).

## What agents should do

- **Run commands in Docker first**: use **`docker compose exec bible_frontend <command>`** for `npm install`, `npm run dev`, `npm run build`, `npm test`, `npx nuxt typecheck`, and similar tasks. Start the stack with **`docker compose up -d`** if the container is not running.
- **Add tests** mirroring **`app/`** layout under **`test/unit/`** or **`test/nuxt/`**; use **`test/e2e/`** only for full-server SSR or browser flows.
- **Match domain boundaries**: API glue in **`composables/services/`**, reader behavior in **`composables/bible/`**, pure helpers in **`utils/`**.
- **Add or extend Zod schemas** when API payloads or forms gain fields; infer types from schemas rather than duplicating interfaces.
- **Use existing bootstrap flows**: do not bypass `$api` for same-origin API calls; respect server-only headers.
- **Preserve pt-BR** for visible strings and SEO unless explicitly asked otherwise.
- **Write code comments in English.**
- **Keep changes scoped** — follow the same file placement and naming as neighboring features.
- **Mirror the nearest feature** when adding UI or API glue — open an existing file in the same folder first.

## What agents should avoid

- Running npm/nuxt commands on the host when the **`bible_frontend`** container is available — prefer Docker for a consistent Node 24 environment and **`bible_network`** connectivity to the backend.
- Introducing a second HTTP client for the main API without strong reason.
- Hardcoding API URLs outside **`runtimeConfig`** / **`env`** validation.
- Adding duplicate type definitions that drift from Zod schemas.
- Large unrelated refactors mixed with feature work.
- Using **`NuxtIcon`** directly in feature components when a semantic **`Icon`** key could be added instead.
- Exposing **`NUXT_API_KEY`** or server-only config to client code.

---

When in doubt, open the closest existing feature (same folder and file type) and mirror its structure.
