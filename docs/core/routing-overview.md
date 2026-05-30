# Routing overview

Mapa de rotas file-based (`app/pages/`). Detalhes de URL bíblica ficam no domínio Bible.

## Rotas

| Rota | Arquivo | Domínio | Comportamento |
|------|---------|---------|---------------|
| `/` | `pages/index.vue` | [Home](../domains/home/landing-page.md) | Landing marketing |
| `/bible` | `pages/bible/index.vue` | [Bible](../domains/bible/overview.md) | Redirect → último capítulo ou João 1 |
| `/bible/[reference]` | `pages/bible/[reference]/index.vue` | Bible | Leitor de capítulo |
| `/help` | `pages/help/index.vue` | [Help](../domains/help/help-center.md) | Central de ajuda |

## Layout compartilhado

Todas as rotas usam `layouts/default.vue` ([App shell](./app-shell.md)).

Não há layouts aninhados por domínio hoje — oportunidade futura para isolar bootstrap Bible.

## Navegação entre domínios

| De | Para | Mecanismo |
|----|------|-----------|
| Home | Bible | `useNavigateToBible().lastChapterUrl` |
| Header | Bible | Links + SearchModal |
| Header | Help | `RouterLink` / dropdown |
| Help | Home | Botão voltar |
| Bible | — | Nav interna prev/next capítulo |

`useNavigateToBible` vive em `composables/` (não em `bible/`) porque Home também consome — mas a **semântica** é domínio Bible: [urls-and-references.md](../domains/bible/urls-and-references.md).

## Adicionar rota nova

1. Criar `pages/<rota>/index.vue`.
2. Decidir domínio → criar doc em `docs/domains/<nome>/` se não existir.
3. SEO: `useSeoMeta` na page + entrada no sitemap se indexável ([SEO](./seo.md)).
4. Se a rota precisar de dados globais, evitar depender de `versionStore` a menos que seja feature bíblica.

## Nitro / server routes

| Rota | Arquivo | Propósito |
|------|---------|-----------|
| Sitemap URLs | `server/api/__sitemap__/urls.ts` | Feed `@nuxtjs/seo` |

Lógica pura extraída para testabilidade — ver [SEO](./seo.md) e [Catalog](../domains/bible/catalog-and-metadata.md).
