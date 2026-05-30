# App shell

O **shell** é tudo que envolve o conteúdo de cada page sem ser regra de negócio de um domínio específico.

Arquivo central: `app/layouts/default.vue`

## Responsabilidades da plataforma

| Responsabilidade | Onde |
|------------------|------|
| Estrutura visual (header + footer de slot) | Template do layout |
| Meta global (og:image, canonical) | `useSeoMeta` / `useHead` no layout |
| Modais registrados uma vez | Template + refs |
| Atalhos globais (client) | `onMounted` no layout |

## O que **não** deveria ser idealmente no shell

Hoje o layout também **bootstrapa o catálogo bíblico** (versões + livros). Isso acopla o domínio Bible à plataforma — documentado em [Bible overview](../domains/bible/overview.md). Ao adicionar features não-bíblicas, evite expandir esse acoplamento.

## Template

```vue
<div class="min-h-screen flex flex-col justify-between">
  <LayoutHeader />
  <slot />
  <BibleSearchModal ref="searchModalRef" />
  <HelpSupportModal ref="supportModalRef" />
</div>
```

| Elemento | Domínio | Por que está no shell |
|----------|---------|------------------------|
| `LayoutHeader` | Core (`layout/header/`) | Chrome em todas as rotas |
| `BibleSearchModal` | Bible | Atalho de teclado global — ver [Search and selector](../domains/bible/search-and-selector.md) |
| `HelpSupportModal` | Help | Aberto do header via `useSupportModal` |

## SEO global

No layout:

- `ogImage`, `twitterCard`, imagem fixa Bibleasy
- `canonical` = origin + `route.fullPath`

Meta **por page** (título, description, schema específico) ficam em cada `pages/*/index.vue`. Ver [SEO](./seo.md).

## Padrão: modal global sem prop drilling

Exemplo Help — replicável para outros modais cross-route:

1. Modal no layout com `ref`.
2. Composable `useSupportModal()` com `useState` guarda controller.
3. `onMounted` → `supportModal.registerRef(supportModalRef)`.
4. Qualquer componente chama `useSupportModal().open()`.

Arquivos: `composables/useSupportModal.ts`, `components/help/support/SupportModal.vue`.

## Falha cedo

Sem versões/livros da API, o layout chama `createAppError` — a app inteira para. E2E e dev local precisam de backend ou mocks. Ver [HTTP layer](./http-layer.md).

## Checklist: alterar o shell

- [ ] Novo modal global? Mesmo padrão ref + composable de registro.
- [ ] Novo fetch no layout? Questionar se é realmente cross-domain ou deveria ir a um domínio/layout aninhado.
- [ ] Novo atalho de teclado? Guard para inputs e modificadores (ver Search no domínio Bible).
