<script setup lang="ts">
import type { Version } from '~/types/version/Version.type'

const emit = defineEmits<{
  select: [version: Version]
}>()

const versionStore = useVersionStore()

const versionSearch = ref('')
const dialogRef = useTemplateRef<HTMLDialogElement>('dialogRef')

const languageNames: Record<string, string> = {
  pt_br: 'Português',
  en: 'English'
}

const filteredVersions = computed(() => {
  if (!versionSearch.value) return versionStore.versions

  const searchValue = versionSearch.value.toLowerCase()

  return versionStore.versions.filter(v => 
    v.name.toLowerCase().includes(searchValue) || 
    v.full_name.toLowerCase().includes(searchValue)
  )
})

const open = () => {
  dialogRef.value?.showModal()
}

const close = () => {
  dialogRef.value?.close()
}

const selectVersion = (version: Version) => {
  emit('select', version)
  close()
}

defineExpose({
  open
})
</script>

<template>
  <dialog
    ref="dialogRef"
    class="modal modal-bottom sm:modal-middle"
    @click.self="close"
  >
    <div class="modal-box max-w-2xl sm:rounded-lg max-sm:max-w-full max-sm:w-full max-sm:h-[calc(100vh-4rem)] max-sm:mb-0 max-sm:mt-16 max-sm:rounded-b-none max-sm:flex max-sm:flex-col">
      <!-- Header with close button -->
      <div class="flex items-center justify-between mb-4 shrink-0">
        <h3 class="font-bold text-lg">
          Selecionar Versão
        </h3>
        <button 
          class="btn btn-sm btn-ghost btn-circle"
          @click="close"
        >
          <Icon icon="close" :size="20" />
        </button>
      </div>

      <!-- Current Version -->
      <div v-if="versionStore.currentVersion" class="alert mb-4 shrink-0">
        <div>
          <div class="font-semibold">
            Versão Atual
          </div>
          <div class="text-sm">
            {{ versionStore.currentVersion.name }} - {{ versionStore.currentVersion.full_name }}
          </div>
        </div>
      </div>
      
      <!-- Search input -->
      <div class="mb-4 shrink-0">
        <div class="form-control">
          <input
            v-model="versionSearch"
            type="text"
            placeholder="Buscar versão..."
            class="input input-bordered w-full"
          />
        </div>
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
            <div class="font-semibold">{{ version.name }}</div>
            <div class="text-sm text-base-content/70">{{ version.full_name }}</div>
            <div class="text-xs text-base-content/50 mt-1">
              {{ languageNames[version.language] || version.language }}
            </div>
          </div>
          <Icon icon="chevron_right" :size="20" class="text-base-content/40 self-center" />
        </button>
      </div>
    </div>
  </dialog>
</template>

