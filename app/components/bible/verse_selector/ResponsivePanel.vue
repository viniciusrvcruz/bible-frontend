<script setup lang="ts">

const isOpen = ref(false)
const lgBreakpoint = ref<MediaQueryList | null>(null)

onMounted(() => {
  lgBreakpoint.value = window.matchMedia('(min-width: 1024px)')
  lgBreakpoint.value?.addEventListener('change', handleBreakpointChange)
})

const handleBreakpointChange = (e: MediaQueryListEvent) => {
  if (e.matches) isOpen.value = false
}

onBeforeUnmount(() => {
  lgBreakpoint.value?.removeEventListener('change', handleBreakpointChange)
})
</script>

<template>
  <input v-model="isOpen" type="checkbox" id="select_verse_modal" class="modal-toggle" />
  <div
    class="lg:w-1/5 lg:sticky lg:top-header lg:h-screen-header"
    :class="{'modal': isOpen}"
    role="dialog"
  >
    <div
      class="hidden p-0 h-full sm:h-4/5 overflow-hidden lg:block lg:w-full lg:h-full lg:rounded-none lg:border-e-2 lg:border-base-300"
      :class="{'block! modal-box w-full max-w-full rounded-none pb-10 sm:w-2/3 sm:rounded-2xl': isOpen}"
    >
      <div class="flex justify-between items-end ps-8 pt-2 pb-0 pe-2 lg:hidden">
        <span class="text-xl font-bold">
          Seleção de versículo
        </span>
        <label
          for="select_verse_modal"
          class="btn btn-ghost p-2"
        >
          <Icon icon="close" :size="25" />
        </label>
      </div>
      <BibleVerseSelector class="bg-base-100 rounded-2xl" />
    </div>
    <label class="modal-backdrop" for="select_verse_modal" />
  </div>
</template>

