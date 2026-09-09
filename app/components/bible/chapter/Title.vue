<script setup lang="ts">
import type { VerseTitle } from '~/types/verseTitle/verseTitle.type'
import type { VerseReference } from '~/types/verseReference/VerseReference.type'
import { useProcessedVerseParts } from '~/composables/bible/useProcessedVerseParts'
import { VerseTitlePositionEnum, VerseTitleTypeEnum } from '~/types/verseTitle/verseTitle.schema'

const props = defineProps<{
  title: VerseTitle
  references?: VerseReference[]
}>()

const { processedText } = useProcessedVerseParts(
  () => props.title.text,
  () => props.references,
)
</script>

<template>
  <h2
    :class="[
      `${title.position !== VerseTitlePositionEnum.CUSTOM ? 'mb-[1em] mt-[1.3em]' : 'mb-0'}`,
      {'text-[1.15em] font-bold': title.type === VerseTitleTypeEnum.SECTION},
      {'text-[0.850em] font-bold italic': title.type === VerseTitleTypeEnum.REFERENCE},
    ]"
  >
    <template v-for="(part, index) in processedText" :key="index">
      <template v-if="part.type === 'text'">
        {{ part.content }}
      </template>
      <BibleChapterVerseReference
        v-else-if="part.type === 'reference'"
        :reference="part.reference"
      />
    </template>
  </h2>
</template>
