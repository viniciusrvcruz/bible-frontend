<script setup lang="ts">
import type { Version } from '~/types/version/Version.type'
import { useFullscreen } from '~/composables/bible/useBibleFullscreen'

defineProps<{
  bookName: string
  chapterNumber: number
}>()

const emit = defineEmits<{
  'version-select': [version: Version]
}>()

const fontSize = defineModel<string>('fontSize', { required: true })
const fontFamily = defineModel<string>('fontFamily', { required: true })

const versionStore = useVersionStore()
const { isFullscreen, toggle } = useFullscreen()
const historyModalRef = ref()
const versionModalRef = ref()
const shouldAnimate = ref(false)

const fullscreenLabel = computed(() => isFullscreen.value ? 'Sair da tela cheia' : 'Tela cheia')

const handleVersionSelect = (version: Version) => {
  emit('version-select', version)
}

watch(isFullscreen, (newValue, oldValue) => {
  if (newValue && !oldValue) {
    shouldAnimate.value = true
  }
})
</script>

<template>
  <!-- Fullscreen exit button (outside header when in fullscreen) -->
  <div v-if="isFullscreen" class="sticky top-0 z-2">
    <button
      v-tooltip.bottom="fullscreenLabel"
      class="btn absolute top-2 z-3 right-2 lg:right-10 max-lg:btn-sm transition-transform duration-300 ease-in-out"
      :class="{'animate-pulse-scale': shouldAnimate}"
      :aria-label="fullscreenLabel"
      @click="toggle"
    >
      <Icon icon="fullscreen_exit" :size="20" />
      <span class="sr-only">
        {{ fullscreenLabel }}
      </span>
    </button>
    <div class="hidden px-5 py-1 bg-base-100 shadow-sm sticky top-0 z-2 lg:block">
      <span class="text-xs font-bold opacity-70">
        {{ bookName }} {{ chapterNumber }}
      </span>
    </div>
  </div>

  <div v-else class="navbar py-2.5 px-5 bg-base-100 shadow-sm sticky top-0 items-center z-2 hide-on-scroll-chapter-header transition-transform duration-300 ease-out motion-reduce:transition-none lg:px-10">
    <span class="hidden font-bold text-xl lg:inline">
      {{ bookName }} {{ chapterNumber }}
    </span>

    <div class="ms-auto space-x-2 flex items-center">
      <!-- Fullscreen button -->
      <button
        v-tooltip.bottom="fullscreenLabel"
        class="btn btn-sm"
        :aria-label="fullscreenLabel"
        @click="toggle"
      >
        <Icon icon="fullscreen" :size="20" />
        <span class="sr-only">
          {{ fullscreenLabel }}
        </span>
      </button>

      <!-- History button -->
      <button
        v-tooltip.bottom="'Histórico de versículos'"
        class="btn btn-sm"
        aria-label="Abrir histórico de versículos"
        @click="historyModalRef?.open()"
      >
        <Icon icon="history" :size="20" />
        <span class="sr-only">Histórico de versículos</span>
      </button>

      <!-- Font configuration button -->
      <BibleChapterFontConfigDropdown
        v-model:font-size="fontSize"
        v-model:font-family="fontFamily"
      />

      <!-- Version button -->
      <button
        v-tooltip.bottom="'Selecionar versão'"
        class="btn btn-sm"
        aria-label="Selecionar versão da Bíblia"
        @click="versionModalRef?.open()"
      >
        <Icon icon="globe" :size="20" />
        <span class="font-bold">
          {{ versionStore.currentVersion?.abbreviation ?? '-' }}
        </span>
        <span class="sr-only">
          Versão atual: {{ versionStore.currentVersion?.abbreviation ?? '-' }}
        </span>
      </button>
    </div>
  </div>

  <BibleChapterHistoryModal ref="historyModalRef" />
  <BibleChapterVersionModal
    ref="versionModalRef"
    @select="handleVersionSelect"
  />
</template>

<style scoped>
@keyframes chapter-header-pulse-scale {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.25);
  }
}

.animate-pulse-scale {
  animation: chapter-header-pulse-scale .5s ease-in-out 1;
}
</style>


