<script setup lang="ts">
import type { BookNameType } from '~/utils/book'
import { getAllBooks, getBookInfo } from '~/utils/book'
import { normalizeString } from '~/utils/helpers'
import { useNavigateToBible } from '~/composables/useNavigateToBible'
import { useChapterService } from '~/composables/services/useChapterService'

interface ChapterVerses {
  number: number
  verses_count: number
}

// ===== Composables e Stores =====
const { goToChapter } = useNavigateToBible()
const chapterService = useChapterService()
const versionStore = useVersionStore()

// ===== Refs e Estado =====
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
const lastValidChapter = ref<string>('')

// ===== Computed Properties =====
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

// ===== Funções Auxiliares =====
const getNumericValue = (value: string): string => {
  return value.replace(/\D/g, '')
}

const focusInput = (ref: Ref<HTMLInputElement | null | undefined>) => {
  nextTick(() => {
    ref.value?.focus()
  })
}

const moveToVerse = (value: string) => {
  nextTick(() => {
    verseSearch.value = value
    if (verseInputRef.value) {
      verseInputRef.value.value = value
      verseInputRef.value.focus()
    }
  })
}

const clearChapterSelection = () => {
  selectedChapter.value = null
  lastValidChapter.value = ''
}

const validateChapterNumber = (value: string, maxChapters: number): number | null => {
  const num = parseInt(value)
  if (isNaN(num) || num < 1) return null
  return num
}

const canBeLargerChapter = (chapterNum: number, maxChapters: number): boolean => {
  return (chapterNum * 10) <= maxChapters
}

// ===== Watchers =====
watch(filteredBooks, (val) => {
  if (val.length === 1 && !selectedBook.value && bookSearch.value) {
    const book = val[0]
    if (book) {
      selectBook(book)
    }
  }
})

watch(chapterSearch, (search) => {
  if (!selectedBookInfo.value || !search) {
    clearChapterSelection()
    return
  }

  const chapterNum = validateChapterNumber(search, selectedBookInfo.value.chapters)
  if (!chapterNum) {
    clearChapterSelection()
    return
  }

  const maxChapters = selectedBookInfo.value.chapters

  // Número maior que máximo: mover tudo para versículo
  if (chapterNum > maxChapters) {
    clearChapterSelection()
    chapterSearch.value = ''
    moveToVerse(search)
    return
  }

  // Número igual ao máximo: definir capítulo e mover foco
  if (chapterNum === maxChapters) {
    selectedChapter.value = chapterNum
    lastValidChapter.value = search
    focusInput(verseInputRef)
    return
  }

  // Capítulo válido
  selectedChapter.value = chapterNum
  lastValidChapter.value = search

  // Se não pode ser parte de número maior, mover foco
  if (!canBeLargerChapter(chapterNum, maxChapters)) {
    nextTick(() => {
      if (chapterSearch.value === search && selectedChapter.value === chapterNum) {
        verseInputRef.value?.focus()
      }
    })
  }
})

// ===== Handlers de Input =====
const handleBookInput = () => {
  // Se não há valor digitado, limpar seleção
  if (!bookSearch.value) {
    selectedBook.value = null
    chaptersWithVerses.value = []
    return
  }

  // Se há um livro selecionado, verificar se o valor digitado é diferente do nome do livro
  if (selectedBook.value && selectedBookInfo.value) {
    const normalizedInput = normalizeString(bookSearch.value)
    const normalizedBookName = normalizeString(selectedBookInfo.value.name)
    
    // Se o valor digitado não corresponde ao nome do livro selecionado, limpar seleção
    if (!normalizedBookName.startsWith(normalizedInput)) {
      selectedBook.value = null
      chaptersWithVerses.value = []
    }
  }
}

const handleChapterInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  const numericValue = getNumericValue(target.value)

  if (!selectedBookInfo.value) {
    chapterSearch.value = numericValue
    target.value = numericValue
    return
  }

  const fullNumber = parseInt(numericValue)
  const maxChapters = selectedBookInfo.value.chapters

  // Número maior que máximo: manter capítulo válido e mover resto para versículo
  if (!isNaN(fullNumber) && fullNumber > maxChapters && lastValidChapter.value && selectedChapter.value) {
    const extraDigits = numericValue.slice(lastValidChapter.value.length)
    chapterSearch.value = lastValidChapter.value
    target.value = lastValidChapter.value
    moveToVerse(extraDigits)
    return
  }

  // Número igual ao máximo com dígitos extras: mover extras para versículo
  if (!isNaN(fullNumber) && fullNumber === maxChapters && numericValue.length > String(maxChapters).length) {
    const extraDigits = numericValue.slice(String(maxChapters).length)
    chapterSearch.value = String(maxChapters)
    target.value = String(maxChapters)
    moveToVerse(extraDigits)
    return
  }

  chapterSearch.value = numericValue
  target.value = numericValue
}

const handleVerseInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  const numericValue = getNumericValue(target.value)
  verseSearch.value = numericValue
  target.value = numericValue
}

// ===== Handlers de Teclado =====
const handleBookKeydown = (e: KeyboardEvent) => {
  const firstBook = filteredBooks.value[0]

  if (firstBook) return selectBook(firstBook)

  if (selectedBook.value) return chapterInputRef.value?.focus()
}

const handleChapterKeydown = (e: KeyboardEvent) => {
  if (!chapterSearch.value && e.key === 'Backspace' && selectedBook.value) {
    e.preventDefault()
    bookInputRef.value?.select()
    return
  }

  if (e.key === 'Enter') {
    e.preventDefault()
    if (selectedChapter.value || chapterSearch.value) {
      verseInputRef.value?.focus()
    }
  }

  if (e.key === 'Escape') {
    close()
  }
}

const handleVerseKeydown = (e: KeyboardEvent) => {
  if (!verseSearch.value && e.key === 'Backspace' && selectedChapter.value) {
    e.preventDefault()
    chapterInputRef.value?.select()
    return
  }

  if (e.key === 'Enter') {
    e.preventDefault()
    navigate()
  }

  if (e.key === 'Escape') {
    close()
  }
}

// ===== Métodos Principais =====
const getChaptersWithVerses = async (book: BookNameType) => {
  if (!versionStore.currentVersion) return

  try {
    const chapters = await chapterService.index(book, versionStore.currentVersion.id)
    chaptersWithVerses.value = chapters.map(c => ({
      number: c.number,
      verses_count: c.verses_count
    }))
  } catch (error) {
    console.error(error)
  }
}

const selectBook = (book: { key: BookNameType; info: { name: string; chapters: number } }) => {
  selectedBook.value = book.key
  bookSearch.value = book.info.name
  chaptersWithVerses.value = []
  getChaptersWithVerses(book.key)
  focusInput(chapterInputRef)
}

const open = (initialChar?: string) => {
  bookSearch.value = initialChar || ''
  chapterSearch.value = ''
  verseSearch.value = ''
  selectedBook.value = null
  selectedChapter.value = null
  chaptersWithVerses.value = []

  dialogRef.value?.showModal()

  nextTick(() => {
    bookInputRef.value?.focus()
    if (bookInputRef.value && initialChar) {
      const length = bookInputRef.value.value.length
      bookInputRef.value.setSelectionRange(length, length)
    }
  })
}

const close = () => {
  dialogRef.value?.close()
  setTimeout(() => {
    bookSearch.value = ''
    chapterSearch.value = ''
    verseSearch.value = ''
    selectedBook.value = null
    selectedChapter.value = null
    chaptersWithVerses.value = []
  }, 200)
}

const navigate = () => {
  if (!selectedBook.value || !selectedChapter.value) return

  const verse = verseSearch.value ? parseInt(verseSearch.value) : undefined
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
    <div class="modal-box max-w-2xl sm:rounded-lg max-sm:max-w-full max-sm:w-full max-sm:h-[calc(100vh-4rem)] max-sm:mb-0 max-sm:mt-16 max-sm:rounded-b-none">
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

      <div class="space-y-4">
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

        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Capítulo</span>
            <span v-if="selectedBookInfo" class="label-text-alt text-base-content/60">
              (máx: {{ selectedBookInfo.chapters }})
            </span>
          </label>
          <input
            ref="chapterInputRef"
            :value="chapterSearch"
            type="text"
            inputmode="numeric"
            :placeholder="selectedBookInfo ? `Digite o capítulo (1-${selectedBookInfo.chapters})...` : 'Selecione um livro primeiro'"
            class="input input-bordered w-full"
            :disabled="!selectedBook"
            @input="handleChapterInput"
            @keydown="handleChapterKeydown"
          />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Versículo (opcional)</span>
            <span v-if="selectedChapterVerses > 0" class="label-text-alt text-base-content/60">
              (máx: {{ selectedChapterVerses }})
            </span>
          </label>
          <input
            ref="verseInputRef"
            :value="verseSearch"
            type="text"
            inputmode="numeric"
            :placeholder="selectedChapter ? `Digite o versículo (1-${selectedChapterVerses})...` : 'Selecione um capítulo primeiro'"
            class="input input-bordered w-full"
            :disabled="!selectedChapter"
            @input="handleVerseInput"
            @keydown="handleVerseKeydown"
          />
        </div>
      </div>

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
