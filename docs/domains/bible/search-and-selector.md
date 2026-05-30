# Search and selector

Busca rápida de livro/capítulo/versículo e painel de navegação lateral — UI de descoberta do domínio Bible.

## `BibleSearchModal`

Arquivo: `app/components/bible/SearchModal.vue`

Montado no **layout global** para atalho de teclado em qualquer rota ([App shell](../../core/app-shell.md)).

### Fluxo em 3 passos

1. **Livro** — autocomplete por prefixo do nome (`normalizeString` + `versionStore.currentVersionBooks`)
2. **Capítulo** — lista capítulos do livro selecionado
3. **Versículo** (opcional) — valida contra `verses_count`

Auto-seleciona livro quando a busca retorna um único resultado.

### API pública

```ts
searchModalRef.value?.open(initialChar?)  // exposto via defineExpose + ref no layout
```

`initialChar` pré-preenche o campo livro (ex.: `g` → Gênesis).

## Atalho de teclado

Handler em `layouts/default.vue` (client only):

| Condição | Ação |
|----------|------|
| Foco em input | ignorado |
| Ctrl/Alt/Shift/Meta | ignorado |
| `[a-zA-Z1-3]` | `searchModalRef.open(char)` |

## `BibleVerseSelectorResponsivePanel`

`app/components/bible/verse_selector/`

- Painel lateral (desktop) / drawer (mobile) na page do capítulo
- Navegação por livro e capítulo usando `versionStore.currentVersionBooks`
- Complementa SearchModal — mesma fonte de dados (catálogo)

## Dependências

| Dado | Fonte |
|------|-------|
| Lista de livros/capítulos | `versionStore` — [Catalog and metadata](./catalog-and-metadata.md) |
| Navegação após seleção | `useNavigateToBible` — [URLs and references](./urls-and-references.md) |

## Implementar melhorias de busca

- Lógica de filtro → manter no modal ou extrair composable `useBibleSearch` se crescer
- Nova tecla de atalho → `default.vue` + documentar conflitos com inputs
- Busca por texto de versículo (full-text) → **novo** endpoint + service; não misturar no modal atual de referência
