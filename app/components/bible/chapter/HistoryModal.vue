<script setup lang="ts">
import { chapterHistorySchema } from '~/types/chapterHistory/ChapterHistory.schema'
import type { ChapterHistory } from '~/types/chapterHistory/ChapterHistory.type'

const STORAGE_KEY = 'chapter-history'
const MAX_HISTORY_ITEMS = 30

const { goToChapter } = useNavigateToBible()

const dialogRef = useTemplateRef<HTMLDialogElement>('dialogRef')
const chapterHistory = ref<ChapterHistory[]>([])

onMounted(() => {
  loadHistory()
})

const loadHistory = () => {
  if (!import.meta.client) return

  const stored = localStorage.getItem(STORAGE_KEY)

  if (!stored) return

  try {
    const parsed = JSON.parse(stored)
    chapterHistory.value = chapterHistorySchema.array().parse(parsed)
  } catch {
    localStorage.removeItem(STORAGE_KEY)
  }
}

const addToHistory = (item: ChapterHistory) => {
  if (!import.meta.client) return

  chapterHistory.value.unshift(item)

  chapterHistory.value = chapterHistory.value.slice(0, MAX_HISTORY_ITEMS)

  localStorage.setItem(STORAGE_KEY, JSON.stringify(chapterHistory.value))
}

const open = () => {
  loadHistory()
  dialogRef.value?.showModal()
}

const close = () => {
  dialogRef.value?.close()
}

const navigateToChapter = (item: ChapterHistory) => {
  goToChapter(item.book, item.chapter, item.verse)
  close()
}

// Formats the chapter display text (e.g., "Genesis 1:5" or "Genesis 1")
const formatChapter = (item: ChapterHistory) => {
  const bookName = getBookInfo(item.book).name

  if (!item.verse) return `${bookName} ${item.chapter}`

  return `${bookName} ${item.chapter}:${item.verse}`
}

const clearHistory = () => {
  chapterHistory.value = []

  if (!import.meta.client) return

  localStorage.removeItem(STORAGE_KEY)
}

defineExpose({
  addToHistory,
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
          Histórico de Leitura
        </h3>
        <button 
          class="btn btn-sm btn-ghost btn-circle"
          @click="close"
        >
          <Icon icon="close" :size="20" />
        </button>
      </div>
      
      <!-- Empty state -->
      <div v-if="chapterHistory.length === 0" class="text-center py-8 text-base-content/60">
        <Icon icon="history" :size="48" class="mx-auto mb-2 opacity-50" />
        <p>
          Nenhuma leitura no histórico ainda.
        </p>
        <p class="text-sm mt-1">
          Navegue pelos capítulos para adicionar ao histórico.
        </p>
      </div>
      
      <!-- History list -->
      <div v-else class="space-y-2 overflow-y-auto flex-1 sm:max-h-96">
        <button
          v-for="(item, index) in chapterHistory"
          :key="index"
          class="w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 border border-base-300 cursor-pointer hover:bg-base-200"
          @click="navigateToChapter(item)"
        >
          <div class="flex-1">
            <div class="font-semibold">
              {{ formatChapter(item) }}
            </div>
            <div class="text-xs text-base-content/60 mt-1 flex items-center gap-2">
              <span>{{ item.versionName }}</span>
              <span>•</span>
              <span>{{ new Date(item.timestamp).toLocaleString('pt-BR') }}</span>
            </div>
          </div>
          <Icon icon="chevron_right" :size="20" class="text-base-content/40 self-center" />
        </button>
      </div>
      
      <!-- Clear action -->
      <div v-if="chapterHistory.length > 0" class="mt-4 pt-4 border-t border-base-300 shrink-0">
        <button 
          class="btn btn-ghost btn-sm w-full"
          @click="clearHistory"
        >
          Limpar Histórico
        </button>
      </div>
    </div>
  </dialog>
</template>
