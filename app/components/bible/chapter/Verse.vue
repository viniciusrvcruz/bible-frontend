<script setup lang="ts">
import type { Verse } from '~/types/verse/Verse.type'
import { useProcessedVerseParts } from '~/composables/bible/useProcessedVerseParts'
import { getContrastTextColor } from '~/utils/color'

const props = defineProps<{
  verse: Verse
  isFocused: boolean
  isSelected?: boolean
  highlightColor?: string | null
}>()

const emit = defineEmits<{
  toggleSelect: []
}>()

const contrastTextClass = computed(() =>
  props.highlightColor
    ? getContrastTextColor(props.highlightColor)
    : null
)

// Processes verse text: {{slug}} → reference, [[slug]] → title
const { processedText } = useProcessedVerseParts(
  () => props.verse.text,
  () => props.verse.references,
  () => props.verse.titles
)

const onClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement

  if (target.closest('button')) return
  if (document.querySelector('.verse-reference-popover')) return

  emit('toggleSelect')
}

</script>

<template>
  <div
    class="p-1 inline leading-[1.9] indent-0 whitespace-pre-line wrap-break-word cursor-pointer transition-colors duration-300 ease-out"
    :class="[
      {
        'relative bg-base-100 rounded shadow-lg z-1': isFocused,
        'border-b-3 border-dotted': isSelected,
        'rounded': !!highlightColor,
      },
      contrastTextClass
     ]"
    :style="highlightColor ? { backgroundColor: highlightColor } : undefined"
    @click="onClick"
  >
    <span
      class="text-[0.8em] align-super leading-0 font-bold me-2 transition-colors duration-300 ease-out"
      :class="highlightColor ? contrastTextClass : 'text-base-content/50'"
    >
      {{ verse.number }}
    </span>
    <div
      class="inline leading-[1.9] transition-colors duration-300 ease-out"
      :class="contrastTextClass"
    >
      <template v-for="(part, index) in processedText" :key="index">
        <template v-if="part.type === 'text'">
          {{ part.content }}
        </template>
        <BibleChapterTitle
          v-else-if="part.type === 'title'"
          :title="part.title"
          :references="verse.references"
          class="text-base-content"
        />
        <BibleChapterVerseReference
          v-else-if="part.type === 'reference'"
          :reference="part.reference"
          :verse-number="verse.number"
        />
      </template>
    </div>
  </div>
</template>
