<script setup lang="ts">
const modalRef = useModalRef('modalRef')

const emit = defineEmits<{
  close: []
}>()

const open = () => {
  modalRef.value?.open()
}

const close = () => {
  modalRef.value?.close()
}

defineExpose({
  open,
  close,
})
</script>

<template>
  <SharedModal
    ref="modalRef"
    id="selected-verses-action-modal"
    :padded="false"
    box-class="w-full max-h-[calc(100dvh-4rem)] flex flex-col"
    @close="emit('close')"
  >
    <slot />
  </SharedModal>
</template>
