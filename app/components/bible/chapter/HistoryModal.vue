<script setup lang="ts">
import type { ChapterHistory } from '~/types/chapterHistory/ChapterHistory.type'
import { useChapterHistory } from '~/composables/bible/useChapterHistory'
import { getDefaultBookName } from '~/utils/bible/book'
import { formatDayLabel, formatTime } from '~/utils/date'
import { useBookService } from '~/composables/services/useBookService'

const versionStore = useVersionStore()
const bookService = useBookService()
const { goToChapter } = useNavigateToBible()
const {
  chapterHistory,
  addToHistory,
  clearHistory,
  loadHistory
} = useChapterHistory()

const modalRef = useModalRef('modalRef')

const open = () => {
  loadHistory()
  modalRef.value?.open()
}

const navigateToChapter = async (item: ChapterHistory) => {
  const version = versionStore.getVersionByAbbreviation(item.versionName)

  if(version?.id !== versionStore.currentVersion?.id) {
    if(!version) return

    await bookService.index(version.id).then((books) => {
      versionStore.setCurrentVersionBooks(books)
      versionStore.setCurrentVersion(version)
    })
  }

  goToChapter(item.book, item.chapter, item.verse)
  modalRef.value?.close()
}

// Formats the chapter display text (e.g., "Genesis 1:5" or "Genesis 1")
const formatChapter = (item: ChapterHistory) => {
  const versionStore = useVersionStore()
  const bookData = versionStore.getBookByAbbreviation(item.book)
  const bookName = bookData?.name ?? getDefaultBookName(item.book)

  if (!item.verse) return `${bookName} ${item.chapter}`

  return `${bookName} ${item.chapter}:${item.verse}`
}

const groupedHistory = computed(() => {
  const getDayKey = (timestamp: number) => {
    const date = new Date(timestamp)
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
  }

  const groups: {
    dayKey: string
    label: string
    items: ChapterHistory[]
  }[] = []

  let currentDayKey: string | null = null
  let currentGroup: (typeof groups)[number] | null = null

  for (const item of chapterHistory.value) {
    const dayKey = getDayKey(item.timestamp)

    if (dayKey !== currentDayKey) {
      currentGroup = {
        dayKey,
        label: formatDayLabel(item.timestamp),
        items: []
      }
      groups.push(currentGroup)
      currentDayKey = dayKey
    }

    currentGroup!.items.push(item)
  }

  return groups
})

const historyItemKey = (item: ChapterHistory) =>
  `${item.book}-${item.chapter}-${item.verse ?? '-'}-${item.versionName}-${item.timestamp}`

defineExpose({
  addToHistory,
  open
})
</script>

<template>
  <SharedModal
    ref="modalRef"
    title="Histórico de Leitura"
    title-id="history-modal-title"
    close-aria-label="Fechar modal de histórico"
  >
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
    <div v-else class="space-y-4 overflow-y-auto flex-1 sm:max-h-96">
      <section
        v-for="group in groupedHistory"
        :key="group.dayKey"
      >
        <h4 class="text-lg font-semibold text-base-content/70 mb-1">
          {{ group.label }}
        </h4>
        <div class="space-y-2">
          <button
            v-for="item in group.items"
            :key="historyItemKey(item)"
            class="w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 border border-base-300 cursor-pointer hover:bg-base-200"
            @click="navigateToChapter(item)"
          >
            <div class="flex-1">
              <div class="font-semibold">
                {{ formatChapter(item) }}
              </div>
              <div class="text-xs text-base-content/60 mt-1 flex items-center gap-2">
                <span class="break-all">{{ versionStore.getVersionByAbbreviation(item.versionName)?.name ?? item.versionName }}</span>
                <span>•</span>
                <span>{{ formatTime(item.timestamp) }}</span>
              </div>
            </div>
            <Icon icon="chevron_right" :size="20" class="text-base-content/40 self-center" />
          </button>
        </div>
      </section>
    </div>

    <template #footer>
      <div v-if="chapterHistory.length > 0" class="mt-4 pt-4 border-t border-base-300">
        <button
          class="btn btn-ghost btn-sm w-full"
          @click="clearHistory"
        >
          Limpar Histórico
        </button>
      </div>
    </template>
  </SharedModal>
</template>
