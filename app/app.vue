<script setup lang="ts">
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
  if (import.meta.client) {
    window.addEventListener('keydown', handleKeydown)
  }
})

onBeforeUnmount(() => {
  if (import.meta.client) {
    window.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col justify-between">
    <Header />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <BibleSearchModal ref="searchModalRef" />
  </div>
</template>
