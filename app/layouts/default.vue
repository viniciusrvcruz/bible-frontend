<script setup lang="ts">
import { useVersionService } from '~/composables/services/useVersionService'
import { useBookService } from '~/composables/services/useBookService'

const versionStore = useVersionStore()
const versionService = useVersionService()
const bookService = useBookService()

const { data: versions } = await versionService.useIndex()

if (!versions.value) {
  throw createAppError('As versões não foram encontradas')
}

versionStore.setVersions(versions.value)

// Load books for current version
const { data: books } = await bookService.useIndex(versionStore.currentVersion!.id)

if (!books.value) {
  throw createAppError('Os livros não foram encontrados')
}

versionStore.setCurrentVersionBooks(books.value)

const searchModalRef = useTemplateRef('searchModalRef')

const handleKeydown = (e: KeyboardEvent) => {
  if (isInputFocused()) return

  if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return

  const char = e.key
  if (char.length === 1 && /[a-zA-Z1-3]/.test(char)) {
    e.preventDefault()
    searchModalRef.value?.open(char)
  }
}

onMounted(() => {
  if (!import.meta.client) return

  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  if (!import.meta.client) return

  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="min-h-screen flex flex-col justify-between">
    <LayoutHeader />

    <slot />

    <BibleSearchModal ref="searchModalRef" />
  </div>
</template>