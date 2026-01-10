<script setup lang="ts">
import type { BookAbbreviationType } from '~/utils/book'
import type { ChapterSelection } from '~/types/chapter/Chapter.type'
import type { VerseSelection } from '~/types/verse/Verse.type'
import { normalizeString } from '~/utils/helpers'

const versionStore = useVersionStore()

interface Props {
  selectVerse?: boolean
  currentBook?: BookAbbreviationType | null
}

const props = withDefaults(defineProps<Props>(), {
  selectVerse: false,
})

const emit = defineEmits<{
  selectChapter: [selection: ChapterSelection]
  selectVerse: [selection: VerseSelection]
}>()

const search = ref('')
const selectedBook = ref<BookAbbreviationType | null>(null)
const selectedChapter = ref<number | null>(null)
const selectionContainerRef = ref<HTMLElement | null>(null)

const selectedBookData = computed(() => {
  if (!selectedBook.value) return null

  return versionStore.getBookByAbbreviation(selectedBook.value) ?? null
})

const selectedChapterData = computed(() => {
  if (!selectedChapter.value || !selectedBookData.value) return null

  return selectedBookData.value.chapters.find(
    c => c.number === selectedChapter.value
  ) ?? null
})

const selectedChapterVerses = computed(() => {
  return selectedChapterData.value?.verses_count ?? 0
})

const filteredBooks = computed(() => {
  const normalizedSearch = normalizeString(search.value)

  return versionStore.currentVersionBooks
    .filter(book => normalizeString(book.name).includes(normalizedSearch))
})

const scrollToTop = (top = 0) => {
  selectionContainerRef.value?.scrollTo({ top })
}

const selectBook = (key: BookAbbreviationType) => {
  selectedBook.value = key
  scrollToTop()
}

const selectChapter = (chapter: number) => {
  if (!selectedBook.value) return

  scrollToTop()

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

  nextTick(() => {
    scrollToCurrentBook()
  })
}

const goBack = () => {
  if (selectedChapter.value) {
    selectedChapter.value = null
    return
  }

  selectedBook.value = null
}

const resetSelection = () => {
  selectedBook.value = null
  selectedChapter.value = null
}

const scrollToCurrentBook = () => {
  if (!props.currentBook || !selectionContainerRef.value) return

  const activeButton = selectionContainerRef.value.querySelector('.btn-active') as HTMLElement
  if (!activeButton) return

  scrollToTop(activeButton.offsetTop - 200)
}

onMounted(() => {
  scrollToCurrentBook()
})

defineExpose({
  scrollToCurrentBook,
})
</script>

<template>
  <section ref="selectionContainerRef" class="p-5 pt-0 overflow-y-auto h-full">
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
          :key="book.abbreviation"
          class="btn btn-ghost justify-start text-base w-full lg:text-sm xl:text-base"
          :class="{ 'btn-active': currentBook === book.abbreviation }"
          @click="selectBook(book.abbreviation)"
        >
          {{ book.name }}
        </button>
      </div>
    </template>

    <!-- Chapter selection view -->
    <template v-else-if="selectedBookData && !selectedChapter">
      <div class="pt-5 bg-base-100 sticky top-0 z-10">
        <button
          class="btn btn-ghost w-full justify-start text-lg font-bold mb-2"
          @click="goBack"
        >
          <Icon icon="chevron_left" :size="20" />
          {{ selectedBookData.name }}
        </button>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="chapter in selectedBookData.chapters"
          :key="chapter.number"
          class="btn btn-ghost bg-base-200 aspect-square w-14"
          @click="selectChapter(chapter.number)"
        >
          {{ chapter.number }}
        </button>
      </div>
    </template>

    <!-- Verse selection view (only when selectVerse prop is true) -->
    <template v-else-if="selectedBookData && selectedChapter">
      <div class="pt-5 bg-base-100 sticky top-0 z-10">
        <button
          class="btn btn-ghost w-full justify-start text-lg font-bold mb-2"
          @click="goBack"
        >
          <Icon icon="chevron_left" :size="20" />
          {{ selectedBookData.name }} {{ selectedChapter }}
        </button>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="verse in selectedChapterVerses"
          :key="verse"
          class="btn btn-ghost bg-base-200 aspect-square w-14"
          @click="selectVerseNumber(verse)"
        >
          {{ verse }}
        </button>
      </div>
    </template>
  </section>
</template>
