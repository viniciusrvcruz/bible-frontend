<script setup lang="ts">
defineProps<{
  iconSize?: number
  removeSeparators?: boolean
}>()
</script>

<template>
  <div class="flex items-center justify-center gap-4 flex-wrap">
    <a
      href="https://github.com/viniciusrvcruz/bible-frontend"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-2 text-inherit underline hover:text-primary hover:opacity-80 transition-colors"
      title="Repositório do Projeto no GitHub"
    >
      <Icon icon="github" :size="iconSize || 20" />
      <span>Repositório</span>
    </a>
    <span v-if="!removeSeparators" class="text-base-content/40">•</span>
    <a
      href="https://www.linkedin.com/in/viniciuscruz7"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-2 text-inherit underline hover:text-primary hover:opacity-80 transition-colors"
      title="LinkedIn"
    >
      <Icon icon="linkedin" :size="iconSize || 20" />
      <span>Vinicius Cruz</span>
    </a>
  </div>
</template>

