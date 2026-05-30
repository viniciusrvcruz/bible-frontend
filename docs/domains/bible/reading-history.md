# Reading history

Último capítulo lido e histórico de navegação — persistência client do domínio Bible.

## Último capítulo — `lastChapterStore`

`app/stores/lastChapterStore.ts`

**Cookie:** `last-chapter-reference` — `{book}.{chapter}[.{version}]`

| Campo | Exemplo |
|-------|---------|
| `book` | `jhn` |
| `chapter` | `3` |
| `version` | `acf` (opcional) |

| Consumidor | Uso |
|------------|-----|
| `/bible` redirect | `goToLastChapter(true)` |
| `LastChapterLink`, header | Link rápido |
| Home schema | `lastChapterUrl` no ItemList |

Setado em `pages/bible/[reference]/index.vue` após capítulo carregar com sucesso.

Parsing compartilha lógica com URLs — [urls-and-references.md](./urls-and-references.md).

## Histórico de leitura — `useChapterHistory`

`app/composables/bible/useChapterHistory.ts`

| Aspecto | Valor |
|---------|-------|
| Storage | `localStorage` key `chapter-history` |
| Máximo | 30 itens |
| Validação | `chapterHistorySchema` (Zod) |
| UI | `HistoryModal` no header do capítulo |

Registro no `onMounted` de `BibleChapter`:

```ts
addToHistory({ book, chapter, verse?, versionName, timestamp })
```

## Padrões de persistência

Seguem [Persistence patterns](../../core/persistence-patterns.md):

- Guard client-only
- JSON corrompido → limpar chave
- Não participa de SSR

## O que não persiste aqui

| Feature | Onde |
|---------|------|
| Highlights | [Verses and placeholders](./verses-and-placeholders.md) |
| Versículos selecionados | Estado local — reset no remount |
| Versão preferida | `versionStore` cookie — [Catalog](./catalog-and-metadata.md) |

## Sync futuro

Histórico e último capítulo são **device-local**. Conta de usuário / backend exigiria novo service e revisão de stores — manter interfaces dos composables se possível.
