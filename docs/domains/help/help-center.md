# Help center

Domínio **Help** — rota `/help`, documentação in-app e suporte.

## Rota e arquivo

| Rota | Arquivo |
|------|---------|
| `/help` | `app/pages/help/index.vue` |

## Estrutura da page

Single page com âncoras internas:

| Seção (componente) | `#anchor` | Conteúdo |
|------------------|-----------|----------|
| `HelpSuggestionsBugs` | `#suggestions-bugs` | Abrir modal de suporte |
| `HelpCustomization` | `#customization` | Temas e versões |
| `HelpSearch` | `#search` | Como usar busca Bible |
| `HelpFAQ` | `#faq` | Perguntas frequentes |
| `HelpFutureFeatures` | `#future-features` | Roadmap |

Navegação rápida: grid de cards no topo com `navigationItems`.

Pasta: `app/components/help/`.

## Modal de suporte (global)

| Arquivo | Papel |
|---------|-------|
| `components/help/support/SupportModal.vue` | UI do modal |
| `components/help/support/SupportForm.vue` | Formulário |
| `components/help/support/SupportAttachmentPreview.vue` | Preview de anexos |
| `composables/useSupportModal.ts` | Registro + `open()` cross-route |

Modal montado em `layouts/default.vue` — padrão [App shell](../../core/app-shell.md).

Fluxo:

1. Layout registra ref no mount.
2. Header / seção Help chama `useSupportModal().open()`.

## API de suporte

`composables/services/useSupportService.ts`

```ts
create({ type, description, email?, files[] }) → POST support (FormData)
```

Usa [HTTP layer](../../core/http-layer.md) — `useApi().post` com `FormData` (sem JSON Content-Type).

**Domínio Help** — não colocar lógica de suporte em `composables/bible/`.

## SEO

- `useSeoMeta` — Central de Ajuda pt-BR
- `useSchemaOrg` — `FAQPage`

Sitemap: entrada `/help` em `buildSitemapEntries()` — ver [SEO](../../core/seo.md).

## Conteúdo vs Bible

Seções como `HelpSearch` e `HelpCustomization` **documentam** features Bible mas vivem no domínio Help (copy estática). Implementação real:

- Busca → [Bible search](../bible/search-and-selector.md)
- Temas → [Components and UI](../../core/components-and-ui.md)
- Versões → [Catalog](../bible/catalog-and-metadata.md)

## Adicionar seção de ajuda

1. Componente `Help<Nome>.vue` em `components/help/`.
2. Entrada em `navigationItems` na page.
3. Âncora `#kebab-case` consistente.
4. Se precisar enviar dados ao backend → estender `useSupportService` ou novo service Help.

## Fora deste domínio

- Leitor e busca (implementação) → [Bible](../bible/overview.md)
- Layout e modais globais → [App shell](../../core/app-shell.md)
