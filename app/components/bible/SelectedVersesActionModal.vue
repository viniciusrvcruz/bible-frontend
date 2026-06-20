<script setup lang="ts">
const dialogRef = useTemplateRef<HTMLDialogElement>('dialogRef')

const emit = defineEmits<{
  close: []
}>()

const open = () => {
  dialogRef.value?.showModal()
}

const close = () => {
  dialogRef.value?.close()
}

const handleClose = () => {
  close()
}

defineExpose({
  open,
  close,
})
</script>

<template>
  <dialog
    ref="dialogRef"
    id="selected-verses-action-modal"
    class="modal modal-bottom sm:modal-middle"
    @click.self="handleClose"
    @close="emit('close')"
  >
    <div class="modal-box max-w-2xl w-full max-h-[calc(100dvh-4rem)] flex flex-col p-0 sm:rounded-lg max-sm:max-w-full max-sm:mb-0 max-sm:mt-16 max-sm:rounded-b-none">
      <slot />
    </div>
  </dialog>
</template>
