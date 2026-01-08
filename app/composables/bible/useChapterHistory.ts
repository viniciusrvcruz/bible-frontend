import type { ChapterHistory } from '~/types/chapterHistory/ChapterHistory.type'
import { chapterHistorySchema } from '~/types/chapterHistory/ChapterHistory.schema'

const STORAGE_KEY = 'chapter-history'
const MAX_HISTORY_ITEMS = 30

export const useChapterHistory = () => {
  const chapterHistory = ref<ChapterHistory[]>([])

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

    loadHistory()

    chapterHistory.value.unshift(item)
    chapterHistory.value = chapterHistory.value.slice(0, MAX_HISTORY_ITEMS)

    localStorage.setItem(STORAGE_KEY, JSON.stringify(chapterHistory.value))
  }

  const clearHistory = () => {
    chapterHistory.value = []

    if (!import.meta.client) return

    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    chapterHistory,
    addToHistory,
    clearHistory,
    loadHistory
  }
}

