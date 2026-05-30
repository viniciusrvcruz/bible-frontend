# Components and UI

Convenções de UI **compartilhadas**. Componentes específicos de cada domínio estão em `app/components/<domínio>/`.

## Organização de pastas

```
app/components/
├── layout/header/   # Core — chrome global
├── shared/          # Core — widgets reutilizáveis
├── Icon.vue         # Core — ícones semânticos
├── home/            # Domain Home
├── help/            # Domain Help
└── bible/           # Domain Bible
```

Regra: novo componente vai na pasta do **domínio** da feature. Só `layout/`, `shared/` e `Icon.vue` são core (shared infra).

### Registro Nuxt

`components/bible/chapter/index.vue` → `<BibleChapter>`. Prefira `index.vue` em subpastas coesas.

## Bibliotecas

| Necessidade | Escolha |
|-------------|---------|
| Botões, layout, temas | **DaisyUI** |
| Dialogs/inputs complexos | **PrimeVue** (Aura global) |
| Ícones | **`Icon`** — nunca `NuxtIcon` direto em features |
| Animação | Tailwind + `<Transition>` |

Config: `nuxt.config.ts`, estilos globais: `app/assets/css/main.css`.

## Ícones

`Icon.vue` — mapa `ICON_MAP`. Nova chave semântica aqui; não espalhar strings Iconify.

## Temas

- `@nuxtjs/color-mode`, cookie `theme`
- UI: `ThemeSelectorPopover.vue` (header)
- Utilities CSS: `h-header`, `top-header`, `h-screen-header` — usadas principalmente no leitor Bible

## Header global

`components/layout/header/index.vue` — logo, tema, help, user menu, links Bible (consome domínio Bible indiretamente).

## Padrão de SFC

```vue
<script setup lang="ts">
// types → props/emits → composables → computed/refs → handlers → lifecycle
</script>
```

Comentários em inglês; strings visíveis em pt-BR.

## Modais: global vs local

| Modal | Pasta | Escopo |
|-------|-------|--------|
| `HelpSupportModal` | `help/support/` | Global — [Help](../domains/help/help-center.md) |
| `BibleSearchModal` | `bible/` | Global no layout — [Bible search](../domains/bible/search-and-selector.md) |
| `VersionModal`, `HistoryModal` | `bible/chapter/` | Local ao leitor |

## Criar componente

1. Identificar domínio pela rota/feature.
2. Abrir vizinho na mesma pasta de `components/`.
3. Lógica > ~15 linhas → composable (`composables/` ou `composables/bible/`).
4. Props tipadas via types Zod inferidos.

## Responsividade (referência Bible)

O leitor define breakpoints `lg:` para painel lateral vs modal — ver [Chapter reader](../domains/bible/chapter-reader.md). Outros domínios seguem Tailwind padrão do arquivo mais próximo.

## Assets

- `public/` — estáticos
- CSS entry único: `app/assets/css/main.css` (Tailwind v4)
