<script setup lang="ts">

defineProps<{
  icon: keyof typeof ICON_MAP
  size?: number
}>()

const ICON_MAP = {
  circle_question: 'lucide:circle-question-mark',
  book_open: 'lucide:book-open-text',
  book: 'lucide:book',
  swap_horiz: 'lucide:repeat',

  document: 'mdi:file-document-outline',
  clock: 'mdi:clock-outline',
  edit: 'mdi:pencil',
  help: 'mdi:help-circle-outline',
  palette: 'mdi:palette-outline',
  broom: 'mdi:broom',
  share: 'mdi:share',

  menu: 'lucide:menu',
  home: 'lucide:home',
  user: 'lucide:user',
  book_marked: 'lucide:book-marked',
  check: 'lucide:check',
  chevron_left: 'lucide:chevron-left',
  chevron_right: 'lucide:chevron-right',
  globe: 'lucide:globe',
  search: 'lucide:search',
  close: 'lucide:x',
  keyboard: 'lucide:keyboard',
  rocket: 'lucide:rocket',
  bookmark: 'lucide:bookmark',
  compare: 'lucide:git-compare',
  copy: 'lucide:copy',
  info: 'lucide:info',
  file_text: 'lucide:file-text',
  fullscreen: 'lucide:maximize',
  fullscreen_exit: 'lucide:minimize',
  sparkles: 'lucide:sparkles',
  zap: 'lucide:zap',
  smartphone: 'lucide:smartphone',
  star: 'lucide:star',
  trending_up: 'lucide:trending-up',
  arrow_right: 'lucide:arrow-right',
  heart: 'lucide:heart',
  message_circle: 'lucide:message-circle',
  bug: 'lucide:bug',
  lightbulb: 'lucide:lightbulb',
  attachment: 'lucide:paperclip',

  history: 'tabler:history',
  letter_case: 'tabler:letter-case',

  github: 'simple-icons:github',
  linkedin: 'simple-icons:linkedin',
} as const

</script>

<template>
  <NuxtIcon :name="ICON_MAP[icon]" :size="size" />
</template>