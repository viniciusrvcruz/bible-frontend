<script setup lang="ts">
import type { Version } from '~/types/version/Version.type'
import { normalizeString } from '~/utils/helpers'

const emit = defineEmits<{
  select: [version: Version]
}>()

const versionStore = useVersionStore()

const versionSearch = ref('')
const modalRef = useModalRef('modalRef')

const filteredVersions = computed(() => {
  if (!versionSearch.value) return versionStore.versions

  const searchValue = normalizeString(versionSearch.value)

  return versionStore.versions.filter(v =>
    normalizeString(v.abbreviation).includes(searchValue) ||
    normalizeString(v.name).includes(searchValue)
  )
})

const open = () => {
  modalRef.value?.open()
}

const selectVersion = (version: Version) => {
  emit('select', version)
  modalRef.value?.close()
}

defineExpose({
  open
})
</script>

<template>
  <SharedModal
    ref="modalRef"
    title="Selecionar Versão"
    title-id="version-modal-title"
    close-aria-label="Fechar modal de seleção de versão"
  >
    <!-- Search input -->
    <div class="mb-4 shrink-0">
      <label class="input w-full">
        <Icon icon="search" :size="25" />
        <input
          v-model="versionSearch"
          type="search"
          class="search-input text-base-content"
          placeholder="Buscar versão..."
        />
      </label>
    </div>

    <!-- List of Versions -->
    <div class="space-y-2 overflow-y-auto flex-1 sm:max-h-96">
      <button
        v-for="version in filteredVersions"
        :key="version.id"
        class="w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 border border-base-300 cursor-pointer hover:bg-base-200"
        :class="{
          'bg-primary/10 border-primary': versionStore.currentVersion?.id === version.id
        }"
        @click="selectVersion(version)"
      >
        <div class="flex-1">
          <div class="font-semibold">{{ version.abbreviation }}</div>
          <div class="text-sm text-base-content/70">{{ version.name }}</div>
        </div>
        <Icon icon="chevron_right" :size="20" class="text-base-content/40 self-center" />
      </button>
    </div>
  </SharedModal>
</template>
