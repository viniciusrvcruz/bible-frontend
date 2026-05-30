# Landing page

Domínio **Home** — rota `/`, marketing e entrada para o produto.

## Rota e arquivo

| Rota | Arquivo |
|------|---------|
| `/` | `app/pages/index.vue` |

Layout compartilhado: [App shell](../../core/app-shell.md).

## Estrutura da page

Template compõe seções em ordem:

| Componente | Papel |
|------------|-------|
| `HomeHeroSection` | Hero principal, CTA |
| `HomeVerseOfTheDaySection` | Versículo do dia |
| `HomeQuickAccessSection` | Atalhos (incl. link Bible) |
| `HomeStatsSection` | Números / social proof |
| `HomeFeaturesSection` | Lista de features |
| `HomeCtaSection` | CTA final |
| `HomePageFooter` | Rodapé da landing |

Pasta: `app/components/home/`.

## Versículo do dia

| Arquivo | Papel |
|---------|-------|
| `app/data/verseOfTheDay.ts` | Lista estática `verses` com `day` (1–366) |
| `app/composables/bible/useVerseOfTheDay.ts` | `getTodayVerse()`, `parsePassageId()` |

Lógica Bible reutilizada na home — dados estáticos, **sem** chamada API no mount da landing.

`parsePassageId` usa `getBookAbbreviation` de `utils/bible/book.ts` — links gerados apontam para rotas Bible.

## Acoplamento com Bible

| Uso | Mecanismo |
|-----|-----------|
| Link “continuar lendo” / Bíblia no schema | `useNavigateToBible().lastChapterUrl` |
| Versículo do dia | Composable em `composables/bible/` |

A home **não** carrega catálogo por conta própria — depende do bootstrap global ([Bible overview](../bible/overview.md)).

## SEO

Em `pages/index.vue`:

- `useSeoMeta` — title/description pt-BR
- `useSchemaOrg` — `WebSite`, `WebPage`, `ItemList` com links Início / Bíblia / Ajuda

Detalhes: [SEO](../../core/seo.md).

## Estilo

Background com grid de pontos (`radial-gradient`) — variantes para temas escuros via `:global(html[data-theme=...])` no scoped CSS da page.

## Adicionar seção na landing

1. Novo SFC em `components/home/<Nome>Section.vue`.
2. Importar na page (auto-import Nuxt).
3. Strings pt-BR; comentários inglês.
4. Se a seção precisar de API Bible, preferir composable existente ou link para `/bible` — evitar fetch pesado na `/`.

## Fora deste domínio

- Leitor, busca, catálogo → [Bible domain](../bible/overview.md)
- Temas, header → [Components and UI](../../core/components-and-ui.md)
