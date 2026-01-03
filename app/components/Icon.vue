<script setup lang="ts">

defineProps<{
  icon: keyof typeof ICON_MAP
  size?: number
}>()

const ICON_MAP = {
  circle_question: 'lucide:circle-question-mark',
  book_open: 'lucide:book-open-text',
  document: 'mdi:file-document-outline',
  clock: 'mdi:clock-outline',
  edit: 'mdi:pencil',
  help: 'mdi:help-circle-outline',
  palette: 'mdi:palette-outline',
  menu: 'lucide:menu',
  user: 'lucide:user',
  book_marked: 'lucide:book-marked',
  check: 'lucide:check',
  chevron_left: 'lucide:chevron-left',
  chevron_right: 'lucide:chevron-right',
  history: 'tabler:history',
  letter_case: 'tabler:letter-case',
  globe: 'lucide:globe',
  search: 'lucide:search',
  close: 'lucide:x',
  github: 'simple-icons:github',
  linkedin: 'simple-icons:linkedin',
  keyboard: 'lucide:keyboard',
  rocket: 'lucide:rocket',
  bookmark: 'lucide:bookmark',
  compare: 'lucide:git-compare',
  copy: 'lucide:copy',
  info: 'lucide:info',
} as const

</script>

<template>
  <NuxtIcon :name="ICON_MAP[icon]" :size="size" />
</template>