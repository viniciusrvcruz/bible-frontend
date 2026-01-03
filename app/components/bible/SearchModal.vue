<script setup lang="ts">
import type { BookNameType } from '~/utils/book'
import type { BookInfo } from '~/types/book/Book.type'
import { getAllBooks, getBookInfo } from '~/utils/book'
import { normalizeString } from '~/utils/helpers'
import { useNavigateToBible } from '~/composables/useNavigateToBible'
import { useChapterService } from '~/composables/services/useChapterService'

interface ChapterVerses {
  number: number
  verses_count: number
}

const { goToChapter } = useNavigateToBible()
const chapterService = useChapterService()
const versionStore = useVersionStore()

const dialogRef = useTemplateRef<HTMLDialogElement>('dialogRef')
const bookInputRef = useTemplateRef<HTMLInputElement>('bookInputRef')
const chapterInputRef = useTemplateRef<HTMLInputElement>('chapterInputRef')
const verseInputRef = useTemplateRef<HTMLInputElement>('verseInputRef')

const bookSearch = ref('')
const chapterSearch = ref('')
const verseSearch = ref('')

const selectedBook = ref<BookNameType | null>(null)
const selectedChapter = ref<number | null>(null)
const chaptersWithVerses = ref<ChapterVerses[]>([])

const selectedBookInfo = computed(() => {
  if (!selectedBook.value) return null

  return getBookInfo(selectedBook.value)
})

const selectedChapterVerses = computed(() => {
  if (!selectedChapter.value) return 0

  const chapterData = chaptersWithVerses.value.find(c => c.number === selectedChapter.value)

  return chapterData?.verses_count ?? 0
})

const filteredBooks = computed(() => {
  if (!bookSearch.value) return []

  const normalizedSearch = normalizeString(bookSearch.value)

  return getAllBooks()
    .filter(({ info }) => normalizeString(info.name).startsWith(normalizedSearch))
    .slice(0, 10)
})

const canNavigate = computed(() => {
  return selectedBook.value !== null && selectedChapter.value !== null
})


// Auto-selects the book if there is only one result in the search
watch(filteredBooks, (books) => {
  if (books.length === 1 && !selectedBook.value) {
    const book = books[0]

    if(!book) return

    selectBook(book)
  }
})

/**
 * Opens the modal
 */
 const open = (initialChar?: string) => {
  // Resets all fields
  bookSearch.value = initialChar || ''
  chapterSearch.value = ''
  verseSearch.value = ''
  clearBookSelection()
  selectedChapter.value = null

  dialogRef.value?.showModal()

  // Focuses on the book field after opening
  nextTick(() => bookInputRef.value?.focus())
}

/**
 * Closes the modal
 */
const close = () => {
  dialogRef.value?.close()
}

/**
 * Focuses an input after the next tick
 */
const focusInput = (ref: Ref<HTMLInputElement | null | undefined>) => {
  nextTick(() => ref.value?.focus())
}

/**
 * Validates if a key is invalid for number input
 */
const isInvalidNumberKey = (key: string): boolean => {
  return ['e', 'E', '+', '-', '.'].includes(key)
}

/**
 * Clears the chapter selection
 */
const clearChapterSelection = () => {
  selectedChapter.value = null
}

/**
 * Clears the book selection and its related chapters
 */
const clearBookSelection = () => {
  selectedBook.value = null
  chaptersWithVerses.value = []
}

/**
 * Checks if a number can be part of a larger valid number
 * Ex: if the user typed "1" and the max is 50, it can be "1", "10", "11", etc.
 */
const canBePartOfLargerNumber = (chapterNum: number, maxChapters: number): boolean => {
  return (chapterNum * 10) <= maxChapters
}

/**
 * Processes the chapter search and updates the state
 */
const processChapterSearch = (chapterNum: number | null) => {
  if (!selectedBookInfo.value || chapterNum === null || chapterNum < 1) {
    return clearChapterSelection()
  }

  const maxChapters = selectedBookInfo.value.chapters

  if(chapterNum < 1 || chapterNum > maxChapters) return clearChapterSelection()

  // If the number equals the maximum, selects and moves to verse
  if (chapterNum === maxChapters) {
    selectedChapter.value = chapterNum

    return focusInput(verseInputRef)
  }

  // Valid chapter
  selectedChapter.value = chapterNum

  if(canBePartOfLargerNumber(chapterNum, maxChapters)) return

  // If it cannot be part of a larger number, moves focus to verse
  nextTick(() => focusInput(verseInputRef))
}

/**
 * Processes the verse search and updates the state
 */
const processVerseSearch = (verseNum: number | null) => {
  if (!selectedChapter.value || verseNum === null || verseNum < 1) return

  // If the request hasn't finished yet, uses 176 as default
  const maxVerses = selectedChapterVerses.value || 176

  if(verseNum < 1 || verseNum > maxVerses) return

  // If the number equals the maximum, keeps it selected
  if (verseNum === maxVerses) {
    return navigate()
  }

  if(canBePartOfLargerNumber(verseNum, maxVerses)) return

  navigate()
}

/**
 * Handler for book input
 */
const handleBookInput = () => {
  // If there's no value, clears the selection
  if (!bookSearch.value) {
    clearBookSelection()
    return
  }

  const hasSelectedBook = selectedBook.value && selectedBookInfo.value

  if(!hasSelectedBook) return

  const normalizedInput = normalizeString(bookSearch.value)
  const normalizedBookName = normalizeString(selectedBookInfo.value.name)

  // If it no longer matches, clears the selection
  if (!normalizedBookName.startsWith(normalizedInput)) {
    clearBookSelection()
  }
}

/**
 * Handler for chapter input
 */
const handleChapterInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value

  chapterSearch.value = value

  const chapterNum = Number(value)

  processChapterSearch(chapterNum)
}

/**
 * Handler for verse input
 */
const handleVerseInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value

  verseSearch.value = value

  const verseNum = Number(value)

  processVerseSearch(verseNum)
}

/**
 * Handler for keys in the book field
 */
const handleBookKeydown = (e: KeyboardEvent) => {
  // Enter or Tab: selects the first book or goes to chapter
  const firstBook = filteredBooks.value[0]

  if (firstBook) {
    selectBook(firstBook)
  } else if (selectedBook.value) {
    chapterInputRef.value?.focus()
  }
}

/**
 * Handler for keys in the chapter field
 */
const handleChapterKeydown = (e: KeyboardEvent) => {
  if (isInvalidNumberKey(e.key)) {
    return e.preventDefault()
  }

  // Empty backspace: goes back to book
  if (!chapterSearch.value && e.key === 'Backspace' && selectedBook.value) {
    e.preventDefault()

    return bookInputRef.value?.select()
  }

  // Enter: goes to verse
  if (e.key === 'Enter' && chapterSearch.value) {
    e.preventDefault()
    verseInputRef.value?.focus()
  }
}

/**
 * Handler for keys in the verse field
 */
const handleVerseKeydown = (e: KeyboardEvent) => {
  if (isInvalidNumberKey(e.key)) {
    return e.preventDefault()
  }

  // Empty backspace: goes back to chapter
  if (!verseSearch.value && e.key === 'Backspace' && selectedChapter.value) {
    e.preventDefault()
    return chapterInputRef.value?.select()
  }

  // Enter: navigates to the reference
  if (e.key === 'Enter') {
    e.preventDefault()
    return navigate()
  }
}

/**
 * Loads chapters with verses from the selected book
 */
const loadChaptersWithVerses = (book: BookNameType) => {
  if (!versionStore.currentVersion) return

  chapterService.index(book, versionStore.currentVersion.id)
    .then(chapters => {
      chaptersWithVerses.value = chapters.map(c => ({
        number: c.number,
        verses_count: c.verses_count
      }))
    })
    .catch(console.error)
}

/**
 * Selects a book
 */
const selectBook = (book: { key: BookNameType; info: BookInfo }) => {
  selectedBook.value = book.key
  bookSearch.value = book.info.name
  chaptersWithVerses.value = [] // Clears before loading new ones

  // If the book has only 1 chapter, selects it automatically
  if (book.info.chapters === 1) {
    selectedChapter.value = 1
    chapterSearch.value = '1'
    loadChaptersWithVerses(book.key)
    focusInput(verseInputRef)
  } else {
    loadChaptersWithVerses(book.key)
    focusInput(chapterInputRef)
  }
}

/**
 * Navigates to the selected biblical reference
 */
const navigate = () => {
  if (!selectedBook.value || !selectedChapter.value) return

  const verse = parseInt(verseSearch.value)

  goToChapter(selectedBook.value, selectedChapter.value, verse)

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
    <div class="modal-box max-w-2xl sm:rounded-lg max-sm:max-w-full max-sm:h-[calc(100vh-4rem)] max-sm:mb-0 max-sm:mt-16 max-sm:rounded-b-none">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-bold text-lg">
          Pesquisar Referência Bíblica
        </h3>
        <button
          class="btn btn-sm btn-ghost btn-circle"
          @click="close"
        >
          <Icon icon="close" :size="20" />
        </button>
      </div>

      <!-- Search fields -->
      <div class="space-y-4">
        <!-- Book field -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Livro</span>
          </label>
          <div class="relative">
            <input
              ref="bookInputRef"
              v-model="bookSearch"
              type="text"
              placeholder="Digite o nome do livro..."
              class="input input-bordered w-full"
              @input="handleBookInput"
              @keydown.enter.prevent="handleBookKeydown"
              @keydown.tab.prevent="handleBookKeydown"
            />
            <!-- Suggestions list -->
            <div
              v-if="bookSearch && filteredBooks.length > 0 && !selectedBook"
              class="absolute z-10 w-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
            >
              <button
                v-for="book in filteredBooks"
                :key="book.key"
                class="w-full text-left px-4 py-2 hover:bg-base-200 transition-colors"
                @click="selectBook(book)"
              >
                {{ book.info.name }}
              </button>
            </div>
          </div>
        </div>

        <!-- Chapter field -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Capítulo</span>
            <span v-if="selectedBookInfo" class="label-text-alt text-base-content/60">
              (máx: {{ selectedBookInfo.chapters }})
            </span>
          </label>
          <input
            ref="chapterInputRef"
            type="number"
            class="input input-bordered w-full"
            :value="chapterSearch"
            :min="1"
            :max="selectedBookInfo?.chapters"
            :placeholder="selectedBookInfo ? `Digite o capítulo (1-${selectedBookInfo.chapters})...` : 'Selecione um livro primeiro'"
            :disabled="!selectedBook"
            @input="handleChapterInput"
            @keydown="handleChapterKeydown"
          />
        </div>

        <!-- Verse field -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Versículo (opcional)</span>
            <span v-if="selectedChapterVerses > 0" class="label-text-alt text-base-content/60">
              (máx: {{ selectedChapterVerses }})
            </span>
          </label>
          <input
            ref="verseInputRef"
            type="number"
            class="input input-bordered w-full"
            :value="verseSearch"
            :min="1"
            :max="selectedChapterVerses || 176"
            :placeholder="selectedChapter ? `Digite o versículo (1-${selectedChapterVerses || 176})...` : 'Selecione um capítulo primeiro'"
            :disabled="!selectedChapter"
            @input="handleVerseInput"
            @keydown="handleVerseKeydown"
          />
        </div>
      </div>

      <!-- Actions -->
      <div class="modal-action">
        <button
          class="btn btn-ghost"
          @click="close"
        >
          Cancelar
        </button>
        <button
          class="btn btn-primary"
          :disabled="!canNavigate"
          @click="navigate"
        >
          Navegar
        </button>
      </div>
    </div>
  </dialog>
</template>
