<script setup lang="ts">
import type { Version } from '~/types/version/Version.type'

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
const historyModalRef = ref()
const versionModalRef = ref()

const handleVersionSelect = (version: Version) => {
  emit('version-select', version)
}
</script>

<template>
  <div class="navbar py-2.5 px-5 bg-base-100 shadow-sm sticky top-0 items-center z-2 lg:px-10">
    <span class="hidden font-bold text-xl lg:inline">
      {{ bookName }} {{ chapterNumber }}
    </span>

    <div class="ms-auto space-x-2 flex items-center">
      <!-- History button -->
      <button
        v-tooltip.bottom="'Histórico de versículos'"
        class="btn btn-sm"
        @click="historyModalRef?.open()"
      >
        <Icon icon="history" :size="20" />
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
        @click="versionModalRef?.open()"
      >
        <Icon icon="globe" :size="20" />
        <span class="font-bold">
          {{ versionStore.currentVersion?.abbreviation ?? '-' }}
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

