<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import { isValidHexColor } from '~/utils/color'
import { useFullscreen } from '~/composables/bible/useBibleFullscreen'
import type { SelectedVerseAction } from '~/types/bible/selectedVerseAction.type'
import SelectedVersesCompareVersions from '~/components/bible/SelectedVersesCompareVersions.vue'

const props = defineProps<{
  referenceLabel: string
  copyFn: () => Promise<boolean>
  activeColors?: string[]
}>()

const emit = defineEmits<{
  clear: []
  highlight: [color: string]
  removeHighlight: [color: string]
}>()

const copySuccess = ref(false)
const activeView = shallowRef<Component | null>(null)
const actionModalRef = useTemplateRef('actionModalRef')
const { isFullscreen } = useFullscreen()
const isLargeScreen = useMediaQuery('(min-width: 1024px)')
const preserveActiveViewOnModalCloseDueToResize = ref(false)

const showActionInPanel = computed(() => Boolean(activeView.value && isLargeScreen.value))
const showSelectionContent = computed(() => !activeView.value || !isLargeScreen.value)

const panelClasses = computed(() => [
  'selected-verses-panel flex flex-col bg-base-100 border-t-2 border-base-300 shrink-0 fixed bottom-0 left-0 right-0 z-10 lg:border-t-0 lg:border-s-2 lg:w-4/12 lg:sticky lg:bottom-auto p-4 lg:p-5',
  showActionInPanel.value
    ? 'overflow-hidden'
    : 'overflow-y-auto overflow-x-hidden max-h-[50dvh] lg:max-h-none',
  !isFullscreen.value && 'lg:top-header lg:h-screen-header',
])

const handleCopy = async () => {
  copySuccess.value = false

  const success = await props.copyFn()

  copySuccess.value = success

  if (success) {
    setTimeout(() => { copySuccess.value = false }, 2000)
  }
}

const actionButtons: SelectedVerseAction[] = [
  {
    label: 'Copiar',
    icon: 'copy',
    action: handleCopy,
  },
  {
    label: 'Comparar versões',
    icon: 'compare',
    component: SelectedVersesCompareVersions,
  },
]

const handleCloseView = () => {
  activeView.value = null
  actionModalRef.value?.close()
}

const handleModalClose = () => {
  if (preserveActiveViewOnModalCloseDueToResize.value) {
    preserveActiveViewOnModalCloseDueToResize.value = false
    return
  }

  // The dialog is already closing; avoid closing it again here.
  activeView.value = null
}

const handleOpenView = (component: Component) => {
  activeView.value = component

  if (!isLargeScreen.value) {
    nextTick(() => actionModalRef.value?.open())
  }
}

watch(isLargeScreen, (large) => {
  if (!activeView.value) return

  if (large) {
    // Avoid clearing `activeView` when switching from modal -> inline panel.
    preserveActiveViewOnModalCloseDueToResize.value = true
    return actionModalRef.value?.close()
  }

  nextTick(() => actionModalRef.value?.open())
})

const MARKER_COLORS = [
  '#AFFF90',
  '#FFFF00',
  '#7AC8FF',
  '#FFC37A',
  '#B4A6FF',
  '#FF9F9F',
  '#BBDFFF',
  '#FF7AE2',
  '#8A38F5',
]

const activeColorsSet = computed(() => new Set(props.activeColors ?? []))

const allColors = computed(() => {
  const active = props.activeColors ?? []
  const combined = [...active]

  for (const c of MARKER_COLORS) {
    if (!combined.includes(c)) combined.push(c)
  }

  return combined
})

const isColorActive = (color: string) => activeColorsSet.value.has(color)

const handleColorClick = (color: string) => {
  if (isColorActive(color)) {
    emit('removeHighlight', color)
  } else {
    emit('highlight', color)
  }
}
</script>

<template>
  <div :class="panelClasses">
    <BibleSelectedVersesActionModal
      ref="actionModalRef"
      @close="handleModalClose"
    >
      <component
        v-if="activeView"
        :is="activeView"
        in-modal
        class="flex flex-col flex-1 min-h-0 h-full overflow-hidden"
        @back="handleCloseView"
      />
    </BibleSelectedVersesActionModal>

    <component
      v-if="showActionInPanel"
      :is="activeView"
      :in-modal="false"
      class="flex-1 min-h-0 flex flex-col overflow-hidden"
      @back="handleCloseView"
    />

    <template v-if="showSelectionContent">
      <!-- Header -->
      <div class="stagger-item stagger-1 flex justify-between items-center mb-2 shrink-0">
        <span class="font-bold text-xl text-base-content flex-1 me-2 min-w-0 wrap-break-word">
          {{ referenceLabel }}
        </span>
        <button
          type="button"
          class="btn btn-circle btn-xl transition-transform duration-200 hover:scale-110 active:scale-95"
          aria-label="Fechar seleção"
          @click="emit('clear')"
        >
          <Icon icon="close" :size="20" />
        </button>
      </div>

      <!-- Marking -->
      <div class="stagger-item stagger-2 mb-4">
        <h3 class="text-sm font-semibold text-base-content/70 mb-2">
          Marcação
        </h3>
        <div class="flex gap-2 overflow-x-auto overflow-y-hidden py-2 px-0.5 lg:flex-wrap lg:overflow-visible">
          <button
            v-for="color in allColors"
            :key="color"
            type="button"
            class="relative w-10 h-10 shrink-0 rounded-full flex items-center justify-center overflow-hidden cursor-pointer border-2 transition-all duration-200 ease-out hover:scale-110 active:scale-95"
            :class="[
              isColorActive(color)
                ? 'border-base-content/40 ring-2 ring-base-content/20 ring-inset'
                : 'border-transparent hover:border-base-content/30',
            ]"
            :style="{
              backgroundColor: isValidHexColor(color) ? color : '#94a3b8',
            }"
            :aria-label="
              isColorActive(color)
                ? `Remover marcação ${color}`
                : `Aplicar marcação ${color}`
            "
            @click="handleColorClick(color)"
          >
            <Transition name="marker-fade">
              <span
                v-if="isColorActive(color)"
                class="absolute inset-0 flex items-center justify-center bg-black/25 transition-opacity duration-200"
              >
                <Icon
                  icon="close"
                  :size="16"
                  class="text-white drop-shadow-sm"
                />
              </span>
            </Transition>
          </button>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="stagger-item stagger-3 mb-5">
        <BibleSelectedVersesActionButtons
          :actions="actionButtons"
          :copy-success="copySuccess"
          @open-view="handleOpenView"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
/* Staggered reveal when panel opens (parent transition applies .selected-verses-enter-active to root) */
.selected-verses-panel.selected-verses-enter-active .stagger-item {
  animation: selected-verses-fade-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.selected-verses-panel.selected-verses-enter-active .stagger-1 { animation-delay: 0.05s; }
.selected-verses-panel.selected-verses-enter-active .stagger-2 { animation-delay: 0.12s; }
.selected-verses-panel.selected-verses-enter-active .stagger-3 { animation-delay: 0.19s; }

@keyframes selected-verses-fade-in {
  from {
    opacity: 0;
    transform: translateY(0.5rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.marker-fade-enter-active,
.marker-fade-leave-active {
  transition: opacity 0.2s ease;
}
.marker-fade-enter-from,
.marker-fade-leave-to {
  opacity: 0;
}
</style>
