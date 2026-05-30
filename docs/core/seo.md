# SEO

Padrões de SEO **transversais**. Copy e schema específicos ficam em cada page/domínio.

## Stack

- `@nuxtjs/seo` — sitemap, helpers
- `useSeoMeta`, `useHead`, `useSchemaOrg` nas pages
- PWA: `@vite-pwa/nuxt` em `nuxt.config.ts`
- Analytics: `nuxt-gtag`, `nuxt-clarity-analytics`

## Camadas de meta

| Camada | Onde | O que define |
|--------|------|--------------|
| Global | `layouts/default.vue` | og:image, twitter card, canonical |
| Por page | `pages/*/index.vue` | title, description, schema específico |

### Pages existentes

| Page | Schema destacado |
|------|------------------|
| `/` | `WebSite`, `WebPage`, `ItemList` — [Home](../domains/home/landing-page.md) |
| `/bible/[reference]` | `WebPage`, `Article` — [Chapter reader](../domains/bible/chapter-reader.md) |
| `/help` | `FAQPage` — [Help center](../domains/help/help-center.md) |

Idioma visível e meta: **pt-BR** (`inLanguage: 'pt-BR'` onde aplicável).

## Sitemap

**Nitro:** `server/api/__sitemap__/urls.ts` → `defineSitemapEventHandler`.

**Lógica pura:** `app/utils/bible/sitemapUrls.ts` — função `buildSitemapEntries()`.

Entradas hoje:

| `loc` | Origem |
|-------|--------|
| `/`, `/help` | Fixas na função |
| `/bible/{book}.{chapter}` | Loop em `BOOKS` — domínio Bible |

Detalhes das URLs de capítulo: [Catalog and metadata](../domains/bible/catalog-and-metadata.md).

Testes: `test/unit/utils/bible/sitemapUrls.test.ts` (unit, sem Nuxt).

## Checklist: nova page indexável

1. `useSeoMeta` com title/description pt-BR.
2. Schema.org se fizer sentido (FAQ, Article, etc.).
3. Entrada em `buildSitemapEntries()` se deve aparecer no sitemap.
4. Canonical já vem do layout — não duplicar salvo exceção.

## Checklist: mudança de URL Bible

Ver [urls-and-references.md](../domains/bible/urls-and-references.md) — sitemap, parsers e testes.
