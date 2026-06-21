<script setup lang="ts">
defineProps<{
  iconSize?: number
  removeSeparators?: boolean
}>()
</script>

<template>
  <div class="flex items-center justify-center gap-4 flex-wrap">
    <a
      href="https://github.com/viniciusrvcruz/bibleasy-frontend"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-2 text-inherit underline hover:text-primary hover:opacity-80 transition-colors"
      title="Repositório do Frontend no GitHub"
    >
      <Icon icon="github" :size="iconSize || 20" />
      <span>Frontend</span>
    </a>
    <span v-if="!removeSeparators" class="text-base-content/40">•</span>
    <a
      href="https://github.com/viniciusrvcruz/bibleasy-backend"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-2 text-inherit underline hover:text-primary hover:opacity-80 transition-colors"
      title="Repositório do Backend no GitHub"
    >
      <Icon icon="github" :size="iconSize || 20" />
      <span>Backend</span>
    </a>
  </div>
</template>
