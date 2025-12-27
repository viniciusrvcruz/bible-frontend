<script setup lang="ts">
import type { BookNameEnum } from '~/types/book/Book.enum'
import type { ChapterSelection } from '~/types/chapter/Chapter.type'
import type { VerseSelection } from '~/types/verse/Verse.type'

interface ChapterVerses {
  chapter: number
  verses: number
}

interface Props {
  selectVerse?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selectVerse: false,
})

const emit = defineEmits<{
  selectChapter: [selection: ChapterSelection]
  selectVerse: [selection: VerseSelection]
}>()

const search = ref('')
const selectedBook = ref<BookNameEnum | null>(null)
const selectedChapter = ref<number | null>(null)
const chaptersWithVerses = ref<ChapterVerses[]>([])

const selectedBookInfo = computed(() => {
  if (!selectedBook.value) return null

  return getBookInfo(selectedBook.value)
})

const selectedChapterVerses = computed(() => {
  if (!selectedChapter.value) return 0

  const chapterData = chaptersWithVerses.value.find(c => c.chapter === selectedChapter.value)
  return chapterData?.verses ?? 0
})

const filteredBooks = computed(() => {
  const normalizedSearch = normalizeString(search.value)

  return getAllBooks()
    .filter(({ info }) => normalizeString(info.name).includes(normalizedSearch))
})

// Simula dados vindos da API (capítulos com quantidade de versículos)
const fetchChaptersWithVerses = async (_book: BookNameEnum): Promise<ChapterVerses[]> => {
  // TODO: Substituir por chamada real à API
  // Simulando dados: cada capítulo tem entre 10 e 40 versículos
  const bookInfo = getBookInfo(_book)

  return Array.from({ length: bookInfo.chapters }, (_, i) => ({
    chapter: i + 1,
    verses: Math.floor(Math.random() * 31) + 10, // 10-40 versículos
  }))
}

const selectBook = async (key: BookNameEnum) => {
  selectedBook.value = key

  if (props.selectVerse) {
    chaptersWithVerses.value = await fetchChaptersWithVerses(key)
  }
}

const selectChapter = (chapter: number) => {
  if (!selectedBook.value) return

  if (props.selectVerse) {
    selectedChapter.value = chapter
    return
  }

  emit('selectChapter', {
    book: selectedBook.value,
    chapter,
  })

  resetSelection()
}

const selectVerseNumber = (verse: number) => {
  if (!selectedBook.value || !selectedChapter.value) return

  emit('selectVerse', {
    book: selectedBook.value,
    chapter: selectedChapter.value,
    verse,
  })

  resetSelection()
}

const goBack = () => {
  if (selectedChapter.value) {
    selectedChapter.value = null
    return
  }

  selectedBook.value = null
  chaptersWithVerses.value = []
}

const resetSelection = () => {
  selectedBook.value = null
  selectedChapter.value = null
  chaptersWithVerses.value = []
}
</script>

<template>
  <section class="p-5 pt-0 overflow-y-auto h-full">
    <!-- Book selection view -->
    <template v-if="!selectedBook">
      <div class="pt-5 bg-base-100 sticky top-0 z-10">
        <label class="input mb-2 w-full">
          <Icon icon="search" :size="25" />
          <input
            v-model="search"
            type="search"
            class="grow text-base-content"
            placeholder="Pesquise um livro"
          />
        </label>
      </div>
      <div class="flex flex-col gap-3 md:gap-2 text-start">
        <button
          v-for="book in filteredBooks"
          :key="book.key"
          class="btn btn-ghost justify-start text-base w-full lg:text-sm xl:text-base"
          @click="selectBook(book.key)"
        >
          {{ book.info.name }}
        </button>
      </div>
    </template>

    <!-- Chapter selection view -->
    <template v-else-if="selectedBookInfo && !selectedChapter">
      <div class="pt-5 bg-base-100 sticky top-0 z-10">
        <button
          class="btn btn-ghost w-full justify-start text-lg font-bold mb-2"
          @click="goBack"
        >
          <Icon icon="chevron_left" :size="20" />
          {{ selectedBookInfo.name }}
        </button>
      </div>
      <div class="grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-5 xl:grid-cols-6">
        <button
          v-for="chapter in selectedBookInfo.chapters"
          :key="chapter"
          class="btn btn-ghost bg-base-200 aspect-square"
          @click="selectChapter(chapter)"
        >
          {{ chapter }}
        </button>
      </div>
    </template>

    <!-- Verse selection view (only when selectVerse prop is true) -->
    <template v-else-if="selectedBookInfo && selectedChapter">
      <div class="pt-5 bg-base-100 sticky top-0 z-10">
        <button
          class="btn btn-ghost w-full justify-start text-lg font-bold mb-2"
          @click="goBack"
        >
          <Icon icon="chevron_left" :size="20" />
          {{ selectedBookInfo.name }} {{ selectedChapter }}
        </button>
      </div>
      <div class="grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-5 xl:grid-cols-6">
        <button
          v-for="verse in selectedChapterVerses"
          :key="verse"
          class="btn btn-ghost bg-base-200 aspect-square"
          @click="selectVerseNumber(verse)"
        >
          {{ verse }}
        </button>
      </div>
    </template>
  </section>
</template>
