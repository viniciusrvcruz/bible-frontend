<script setup lang="ts">
import type { VerseReference } from '~/types/verseReference/VerseReference.type'
import { useVerseFocusContext } from '~/composables/bible/useVerseFocusContext'

const props = defineProps<{
  reference: VerseReference
  verseNumber?: number
}>()

const { focusVerseByNumber, clearFocus } = useVerseFocusContext()

const popoverRef = useTemplateRef('popoverRef')
const isPopoverOpen = ref(false)

const toggle = (event: Event) => {
  popoverRef.value?.toggle(event)
}

const close = () => {
  popoverRef.value?.hide()
}

const handleShow = () => {
  isPopoverOpen.value = true

  if (props.verseNumber == null) return

  focusVerseByNumber(props.verseNumber, false)
}

const handleHide = () => {
  isPopoverOpen.value = false

  if (props.verseNumber == null) return

  clearFocus()
}
</script>

<template>
  <div class="inline-flex relative -top-1">
    <button
      type="button"
      class="group inline-flex items-center justify-center align-middle mx-1.5 p-1.5 rounded-md cursor-pointer transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 active:scale-95"
      :class="isPopoverOpen
        ? 'bg-base-200 text-base-content ring-2 ring-base-300 shadow-sm'
        : 'bg-base-100 text-base-content/60 hover:text-base-content/90 hover:bg-base-300'"
      :aria-label="`Ver referência bíblica: ${reference.text}`"
      :aria-expanded="isPopoverOpen"
      @click="toggle"
    >
      <Icon icon="file_text" class="w-[1em] h-[1em] transition-transform duration-200 group-hover:scale-110" />
      <span class="sr-only">Ver referência bíblica</span>
    </button>
    <Popover
      ref="popoverRef"
      class="verse-reference-popover"
      :pt="{ content: { class: 'p-0! rounded-lg!' } }"
      @show="handleShow"
      @hide="handleHide"
    >
      <div class="min-w-xs max-w-sm">
        <div class="flex items-center justify-between bg-base-300 px-3 py-2 rounded-t-box">
          <h3 class="font-semibold text-base-content">Notas e referências</h3>
          <button
            type="button"
            class="btn btn-ghost btn-sm btn-circle text-base-content hover:bg-base-200"
            aria-label="Fechar"
            @click="close"
          >
            <Icon icon="close" :size="20" />
          </button>
        </div>
        <p class="px-4 py-3 leading-relaxed whitespace-pre-line text-base-content text-start">
          {{ reference.text }}
        </p>
      </div>
    </Popover>
  </div>
</template>
