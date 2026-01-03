<script setup lang="ts">
import type { Verse } from '~/types/verse/Verse.type'

defineProps<{
  verse: Verse
  isFocused: boolean
  isFocusActive: boolean
}>()

</script>

<template>
  <p
    class="px-2 py-1 block leading-[1.9] indent-0 cursor-pointer transition-all duration-200 ease-in-out mb-[0.4em]"
    :class="{
      'relative bg-base-100 rounded shadow-lg z-2': isFocused,
      'hover:bg-base-200/50 rounded': !isFocusActive
    }"
  >
    <sup class="text-[0.8em] align-super leading-0 font-bold text-base-content/50 me-2">
      {{ verse.number }}
    </sup>
    <span class="leading-[1.9]">
      {{ verse.text }}
    </span>
  </p>
</template>
