<script setup lang="ts">
import type { Verse } from '~/types/verse/Verse.type'

const props = defineProps<{
  verse: Verse
  isFocused: boolean
  isFocusActive: boolean
}>()

const textLines = computed(() => {
  return props.verse.text.split('\\n')
})
</script>

<template>
  <p
    class="px-2 py-1 block leading-[1.9] indent-0 cursor-pointer transition-all duration-200 ease-in-out mb-[0.4em]"
    :class="{
      'relative bg-base-100 rounded shadow-lg z-2': isFocused,
      'hover:bg-base-200/50 rounded': !isFocusActive
    }"
  >
    <span class="text-[0.8em] align-super leading-0 font-bold text-base-content/50 me-2">
      {{ verse.number }}
    </span>
    <span class="leading-[1.9]">
      <template
        v-for="(line, index) in textLines"
        :key="index"
      >
        {{ line }}
        <br v-if="index < textLines.length - 1">
      </template>
    </span>
  </p>
</template>
