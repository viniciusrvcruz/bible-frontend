import { beforeEach, describe, expect, it } from 'vitest'
import { useChapterHistory } from '~/composables/bible/useChapterHistory'
import type { ChapterHistory } from '~/types/chapterHistory/ChapterHistory.type'

const STORAGE_KEY = 'chapter-history'

const baseEntry = (overrides: Partial<ChapterHistory> = {}): ChapterHistory => ({
  book: 'gen',
  chapter: 1,
  versionName: 'nvi',
  timestamp: 1_700_000_000_000,
  ...overrides,
})

const readStoredHistory = (): ChapterHistory[] =>
  JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')

describe('useChapterHistory', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('addToHistory', () => {
    it('persists a new entry at the top of the history', () => {
      const { chapterHistory, addToHistory } = useChapterHistory()
      const entry = baseEntry()

      addToHistory(entry)

      expect(chapterHistory.value).toEqual([entry])
      expect(readStoredHistory()).toEqual([entry])
    })

    it('does not duplicate the latest entry on reload with the same reference', () => {
      const { chapterHistory, addToHistory } = useChapterHistory()
      const first = baseEntry({ verse: 5 })
      const reload = baseEntry({ verse: 5, timestamp: 1_800_000_000_000 })

      addToHistory(first)
      addToHistory(reload)

      expect(chapterHistory.value).toEqual([first])
      expect(readStoredHistory()).toEqual([first])
    })

    it('does not duplicate when both entries omit verse', () => {
      const { chapterHistory, addToHistory } = useChapterHistory()

      addToHistory(baseEntry())
      addToHistory(baseEntry({ timestamp: 1_800_000_000_000 }))

      expect(chapterHistory.value).toHaveLength(1)
    })

    it('adds a new entry when verse changes', () => {
      const { chapterHistory, addToHistory } = useChapterHistory()
      const verse1 = baseEntry({ verse: 1 })
      const verse2 = baseEntry({ verse: 2, timestamp: 1_800_000_000_000 })

      addToHistory(verse1)
      addToHistory(verse2)

      expect(chapterHistory.value).toEqual([verse2, verse1])
    })

    it('adds a new entry when one entry has verse and the other does not', () => {
      const { chapterHistory, addToHistory } = useChapterHistory()
      const chapter = baseEntry()
      const verse = baseEntry({ verse: 1, timestamp: 1_800_000_000_000 })

      addToHistory(chapter)
      addToHistory(verse)

      expect(chapterHistory.value).toEqual([verse, chapter])
    })

    it('adds a new entry when book, chapter, or version changes', () => {
      const { chapterHistory, addToHistory } = useChapterHistory()
      const first = baseEntry()

      addToHistory(first)
      addToHistory(baseEntry({ book: 'exo', timestamp: 1_800_000_000_001 }))
      addToHistory(baseEntry({ chapter: 2, timestamp: 1_800_000_000_002 }))
      addToHistory(baseEntry({ versionName: 'acf', timestamp: 1_800_000_000_003 }))

      expect(chapterHistory.value).toHaveLength(4)
      expect(chapterHistory.value[0]?.versionName).toBe('acf')
    })

    it('keeps at most 30 entries', () => {
      const { chapterHistory, addToHistory } = useChapterHistory()

      for (let chapter = 1; chapter <= 31; chapter++) {
        addToHistory(baseEntry({ chapter, timestamp: chapter }))
      }

      expect(chapterHistory.value).toHaveLength(30)
      expect(chapterHistory.value[0]?.chapter).toBe(31)
      expect(chapterHistory.value[29]?.chapter).toBe(2)
      expect(readStoredHistory()).toHaveLength(30)
    })
  })

  describe('loadHistory', () => {
    it('loads persisted entries into chapterHistory', () => {
      const stored = [baseEntry(), baseEntry({ book: 'exo', chapter: 2, timestamp: 2 })]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))

      const { chapterHistory, loadHistory } = useChapterHistory()

      loadHistory()

      expect(chapterHistory.value).toEqual(stored)
    })

    it('clears invalid stored data', () => {
      localStorage.setItem(STORAGE_KEY, '{ invalid json')

      const { chapterHistory, loadHistory } = useChapterHistory()

      loadHistory()

      expect(chapterHistory.value).toEqual([])
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    })
  })

  describe('clearHistory', () => {
    it('removes entries from memory and localStorage', () => {
      const { chapterHistory, addToHistory, clearHistory } = useChapterHistory()

      addToHistory(baseEntry())

      expect(chapterHistory.value).toHaveLength(1)

      clearHistory()

      expect(chapterHistory.value).toHaveLength(0)
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    })
  })
})
