<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  titleId?: string
  closeAriaLabel?: string
  padded?: boolean
  closeOnBackdrop?: boolean
  headerBordered?: boolean
}>(), {
  padded: true,
  closeOnBackdrop: true,
  closeAriaLabel: 'Fechar',
  headerBordered: false,
})

const emit = defineEmits<{
  close: []
}>()

const slots = useSlots()
const dialogRef = useTemplateRef<HTMLDialogElement>('dialogRef')
const generatedTitleId = useId()
const resolvedTitleId = computed(() => props.titleId ?? generatedTitleId)

const boxClasses = computed(() => [
  'modal-box max-w-2xl sm:rounded-lg max-sm:max-w-full max-sm:w-full max-sm:h-[calc(100dvh-4rem)] max-sm:mb-0 max-sm:mt-16 max-sm:rounded-b-none max-sm:flex max-sm:flex-col',
  {
    'p-0': !props.padded,
  },
])

const showHeader = computed(() => Boolean(props.title || slots.header))

const open = () => {
  dialogRef.value?.showModal()
}

const close = () => {
  dialogRef.value?.close()
}

const handleBackdropClick = () => {
  if (!props.closeOnBackdrop) return

  close()
}

const handleDialogClose = () => {
  emit('close')
}

defineExpose({
  open,
  close,
} satisfies SharedModalExposed)
</script>

<template>
  <dialog
    ref="dialogRef"
    class="modal modal-bottom sm:modal-middle"
    :aria-labelledby="showHeader ? resolvedTitleId : undefined"
    @click.self="handleBackdropClick"
    @close="handleDialogClose"
  >
    <div :class="boxClasses">
      <slot v-if="$slots.header" name="header" />

      <div
        v-else-if="title"
        class="flex items-center justify-between shrink-0"
        :class="headerBordered ? 'pb-4 border-b border-base-300' : 'mb-4'"
      >
        <h3 :id="resolvedTitleId" class="font-bold text-lg">
          {{ title }}
        </h3>
        <button
          type="button"
          class="btn btn-sm btn-ghost btn-circle"
          :aria-label="closeAriaLabel"
          @click="close"
        >
          <Icon icon="close" :size="20" />
          <span class="sr-only">Fechar</span>
        </button>
      </div>

      <slot />

      <footer v-if="$slots.footer" class="shrink-0">
        <slot name="footer" />
      </footer>
    </div>
  </dialog>
</template>
