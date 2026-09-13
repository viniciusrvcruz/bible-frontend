<script setup lang="ts">
import type { Chapter } from '~/types/chapter/Chapter.type'
import type { VerseTitle } from '~/types/verseTitle/verseTitle.type'
import type { Version } from '~/types/version/Version.type'
import { VerseTitlePositionEnum } from '~/types/verseTitle/verseTitle.schema'
import { useVerseFocus } from '~/composables/bible/useVerseFocus'
import { useSelectedVerses } from '~/composables/bible/useSelectedVerses'
import { provideSelectedVersesContext } from '~/composables/bible/useSelectedVersesContext'
import { provideVerseFocusContext } from '~/composables/bible/useVerseFocusContext'
import { useVerseHighlights } from '~/composables/bible/useVerseHighlights'
import { useChapterHistory } from '~/composables/bible/useChapterHistory'
import { useBookService } from '~/composables/services/useBookService'
import { useFullscreen } from '~/composables/bible/useBibleFullscreen'
import { useHideOnScroll } from '~/composables/bible/useHideOnScroll'

const props = defineProps<{
  chapter: Chapter,
  isLoading: boolean,
}>()

const route = useRoute()
const { goToChapter, getChapterUrl } = useNavigateToBible()
const versionStore = useVersionStore()
const { addToHistory } = useChapterHistory()
const { isFullscreen } = useFullscreen()

const chapterContainerRef = ref<HTMLElement | null>(null)
const { reset: resetHideOnScroll } = useHideOnScroll(chapterContainerRef)

// 1 year in seconds
const cookieMaxAge = 60 * 60 * 24 * 365
const fontSize = useCookie<string>('bible-font-size', {
  default: () => 'text-lg',
  maxAge: cookieMaxAge,
})
const fontFamily = useCookie<string>('bible-font-family', {
  default: () => 'font-sans',
  maxAge: cookieMaxAge,
})

const bookName = computed(() => {
  return props.chapter.book.name
})

const verseNumber = computed(() => {
  if (!route.hash) return null

  return parseInt(route.hash.slice(2))
})

// Returns the index of the current chapter
const currentChapterIndex = computed(() => {
  return versionStore.allChapters.findIndex(
    chapter => 
      chapter.book.abbreviation === props.chapter.book.abbreviation &&
      chapter.number === props.chapter.number
  )
})

// Returns the chapter by index
const getChapterByIndex = (index: number) => {
  return versionStore.allChapters[index] ?? null
}

// Returns the previous chapter data
const previousChapter = computed(() => {
  if (currentChapterIndex.value === -1) return null

  return getChapterByIndex(currentChapterIndex.value - 1)
})

// Returns the next chapter data
const nextChapter = computed(() => {
  if (currentChapterIndex.value === -1) return null

  return getChapterByIndex(currentChapterIndex.value + 1)
})

// Returns the link for the previous chapter
const previousChapterLink = computed(() => {
  if (!previousChapter.value) return null

  return getChapterUrl(
    previousChapter.value.book.abbreviation,
    previousChapter.value.number
  )
})

// Returns the link for the next chapter
const nextChapterLink = computed(() => {
  if (!nextChapter.value) return null

  return getChapterUrl(
    nextChapter.value.book.abbreviation,
    nextChapter.value.number
  )
})

const clearHash = () => {
  history.replaceState(history.state, '', route.path)
}

const getTitlesByPosition = (
  titles: VerseTitle[] | undefined,
  position: VerseTitlePositionEnum
): VerseTitle[] => {
  const list = titles ?? []

  if (position === VerseTitlePositionEnum.START) {
    return list.filter(t => t.position === VerseTitlePositionEnum.START)
  }

  return list.filter(t => t.position === VerseTitlePositionEnum.END)
}

const {
  focusedVerseNumber,
  overlayHeight,
  handleScroll,
  handleVerseFocus,
  focusVerseByNumber,
  clearFocus
} = useVerseFocus(chapterContainerRef, verseNumber, clearHash)

const {
  selectedVerses,
  selectedVersesSet,
  hasSelection,
  toggleVerse,
  clearSelection,
  formattedReference,
  copySelectedVerses,
} = useSelectedVerses()

const chapterKey = `${props.chapter.book.abbreviation}.${props.chapter.number}.${versionStore.currentVersion?.abbreviation ?? ''}`

const {
  loadHighlights,
  getVerseHighlightColor,
  highlightVerses,
  removeHighlightsByColor,
  activeColors,
} = useVerseHighlights(chapterKey, selectedVerses)

const handleHighlight = (color: string) => {
  highlightVerses(selectedVerses.value, color)
  clearSelection()
}

const handleRemoveHighlight = (color: string) => {
  removeHighlightsByColor(selectedVerses.value, color)
  clearSelection()
}

const handleCopySelectedVerses = () =>
  copySelectedVerses({
    verses: props.chapter.verses,
    bookName: props.chapter.book.name,
    chapter: props.chapter.number,
    bookAbbreviation: props.chapter.book.abbreviation,
    versionAbbreviation: versionStore.currentVersion?.abbreviation ?? '',
  })

watch(
  () => [props.chapter.book.abbreviation, props.chapter.number],
  () => {
    resetHideOnScroll()
  },
)

onMounted(() => {
  if (!import.meta.client) return

  loadHighlights()
  addCurrentChapterToHistory()
  handleVerseFocus()
})

const addCurrentChapterToHistory = () => {
  const verseNumber = route.hash ? parseInt(route.hash.slice(2)) : undefined

  addToHistory({
    book: props.chapter.book.abbreviation,
    chapter: props.chapter.number,
    verse: verseNumber,
    versionName: versionStore.currentVersion?.abbreviation ?? '',
    timestamp: Date.now()
  })
}

const handleVersionSelect = (version: Version) => {
  const bookService = useBookService()

  versionStore.setCurrentVersion(version)
  // Load books for the new version
  bookService.index(version.id).then((books) => {
    versionStore.setCurrentVersionBooks(books)

    goToChapter(
      props.chapter.book.abbreviation,
      props.chapter.number,
      verseNumber.value ?? undefined
    )
  })
}

provideSelectedVersesContext({
  selectedVerses,
  bookAbbreviation: computed(() => props.chapter.book.abbreviation),
  chapterNumber: computed(() => props.chapter.number),
  bookName: computed(() => props.chapter.book.name),
})

provideVerseFocusContext({
  focusVerseByNumber,
  clearFocus,
})

</script>

<template>
  <section
    class="flex-1 flex flex-col lg:flex-row overflow-hidden sticky"
    :class="{'h-screen-header top-header': !isFullscreen}"
  >
    <div class="flex-1 flex flex-col overflow-hidden relative min-h-0">
      <!-- Only chapter text scrolls; header stays sticky inside, footer chrome sits below -->
      <div
        ref="chapterContainerRef"
        class="flex flex-col overflow-y-auto flex-1 min-h-0 scroll-smooth relative"
        @scroll="handleScroll"
      >
        <!-- Desktop mini title while chrome is hidden (sticky inside scroll, like ChapterHeader) -->
        <div
          class="hide-on-scroll-compact-header sticky top-0 z-3 px-5 py-1 bg-base-100 border-b border-base-300 shadow-sm"
        >
          <span class="text-xs font-bold opacity-70">
            {{ bookName }} {{ chapter.number }}
          </span>
        </div>

        <BibleChapterHeader
          :book-name="bookName"
          :chapter-number="chapter.number"
          v-model:font-size="fontSize"
          v-model:font-family="fontFamily"
          @version-select="handleVersionSelect"
        />

        <!-- Focus overlay (only in chapter section) -->
        <div 
          v-if="focusedVerseNumber"
          class="absolute top-0 left-0 right-0 bg-black/20 z-1 cursor-pointer transition-opacity duration-300 ease-in-out"
          :style="{ height: `${overlayHeight}px` }"
          @click="clearFocus"
        />

        <!-- Main content -->
        <div
          class="flex-1 px-5 pb-28 sm:px-10 lg:px-20 lg:pb-52"
          :class="{
            'blur-xs': isLoading,
          }"
        >
          <h1 class="text-xl font-bold text-center text-base-content/60 mt-6 mb-2">
            {{ bookName }}
          </h1>
          <h2 class="text-6xl font-bold text-center mb-8 sm:text-7xl">
            {{ chapter.number }}
          </h2>

          <div 
            :class="[
              'max-w-lg mx-auto px-2',
              fontSize,
              fontFamily
            ]"
          >
            <template v-for="verse in chapter.verses" :key="verse.id">
              <!-- Titles with position "start" (or without position) appear before the verse -->
              <BibleChapterTitle
                v-for="(title, index) in getTitlesByPosition(verse.titles, VerseTitlePositionEnum.START)"
                :key="`${verse.id}-start-${index}`"
                :title="title"
                :references="verse.references"
              />

              <BibleChapterVerse
                :id="`v${verse.number}`"
                :verse="verse"
                :is-focused="verse.number === focusedVerseNumber"
                :is-selected="selectedVersesSet.has(verse.number)"
                :highlight-color="getVerseHighlightColor(verse.number)"
                @toggle-select="toggleVerse(verse.number)"
              />

              <!-- Titles with position "end" appear after the verse -->
              <BibleChapterTitle
                v-for="(title, index) in getTitlesByPosition(verse.titles, VerseTitlePositionEnum.END)"
                :key="`${verse.id}-end-${index}`"
                :title="title"
                :references="verse.references"
              />
            </template>
          </div>

          <!-- Version Copyright -->
          <div 
            v-if="versionStore.currentVersion?.copyright"
            v-html="versionStore.currentVersion.copyright"
            class="mt-8 mb-6 text-center text-sm text-base-content/60 max-w-lg mx-auto"
          />

          <div class="divider w-1/2 mx-auto" />

          <BibleChapterFooter />
        </div>
      </div>

      <!-- Compact footer: in-flow below the scroller (scrollbar covers text only) -->
      <div class="hide-on-scroll-compact-footer-slot shrink-0 lg:hidden">
        <div class="border-t border-base-300 px-5 py-1 bg-base-100 shadow-sm">
          <label
            for="select_verse_modal"
            class="flex justify-center cursor-pointer py-1"
            aria-label="Selecionar versículo"
          >
            <span class="text-lg font-bold opacity-70">
              {{ bookName }} {{ chapter.number }}
            </span>
          </label>
        </div>
      </div>

      <!-- Nav overlay (does not own the scrollbar; hides on mobile while scrolling) -->
      <div class="absolute bottom-0 inset-x-0 z-2 flex justify-between pointer-events-none hide-on-scroll-nav transition-transform duration-300 ease-out motion-reduce:transition-none">
        <RouterLink
          v-if="previousChapterLink"
          :to="previousChapterLink"
          class="btn btn-xl btn-circle mb-15 ms-5 border-2 border-base-300 shadow-sm pointer-events-auto lg:ms-10 lg:mb-48 xl:ms-48 2xl:ms-52 nav-btn"
          :class="{ 'lg:ms-4! xl:ms-6! 2xl:ms-8!': hasSelection }"
          :aria-label="previousChapter ? `Ir para ${previousChapter.book.name} ${previousChapter.number}` : 'Capítulo anterior'"
        >
          <Icon icon="chevron_left" />
          <span class="sr-only">
            {{ previousChapter ? `${previousChapter.book.name} ${previousChapter.number}` : 'Capítulo anterior' }}
          </span>
        </RouterLink>

        <label
          for="select_verse_modal"
          class="btn text-sm flex-1 mx-2 mb-15 px-0 py-7 border-2 border-base-300 pointer-events-auto sm:mx-5 sm:text-lg lg:hidden"
          aria-label="Selecionar versículo"
        >
          {{ bookName }} {{ chapter.number }}
        </label>

        <RouterLink
          v-if="nextChapterLink"
          :to="nextChapterLink"
          class="btn btn-xl btn-circle mb-15 me-5 border-2 border-base-300 shadow-sm pointer-events-auto lg:me-10 lg:ms-auto lg:mb-48 xl:me-48 2xl:me-52 nav-btn"
          :class="{ 'lg:me-4! xl:me-6! 2xl:me-8!': hasSelection }"
          :aria-label="nextChapter ? `Ir para ${nextChapter.book.name} ${nextChapter.number}` : 'Próximo capítulo'"
        >
          <Icon icon="chevron_right" />
          <span class="sr-only">
            {{ nextChapter ? `${nextChapter.book.name} ${nextChapter.number}` : 'Próximo capítulo' }}
          </span>
        </RouterLink>
      </div>
    </div>

    <Transition name="selected-verses">
      <BibleSelectedVerses
        v-if="hasSelection"
        :reference-label="formattedReference(bookName, chapter.number)"
        :copy-fn="handleCopySelectedVerses"
        :active-colors="Array.from(activeColors)"
        @clear="clearSelection"
        @highlight="handleHighlight"
        @remove-highlight="handleRemoveHighlight"
      />
    </Transition>
  </section>
</template>

<style scoped>
/* Panel: smooth transition when opening/closing */
:deep(.selected-verses-enter-active) {
  transition:
    opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

:deep(.selected-verses-leave-active) {
  transition:
    opacity 0.3s cubic-bezier(0.55, 0.09, 0.68, 0.53),
    transform 0.3s cubic-bezier(0.55, 0.09, 0.68, 0.53);
}

:deep(.selected-verses-enter-from),
:deep(.selected-verses-leave-to) {
  opacity: 0;
}

:deep(.selected-verses-enter-from) {
  transform: translateX(1.25rem) scale(0.98);
}

:deep(.selected-verses-leave-to) {
  transform: translateX(1.25rem) scale(0.98);
}

@media (max-width: 1023px) {
  :deep(.selected-verses-enter-from) {
    transform: translateY(1rem) scale(0.98);
  }

  :deep(.selected-verses-leave-to) {
    transform: translateY(1rem) scale(0.98);
  }
}

/* Navigation buttons: smooth transition when the panel opens/closes + hover/active */
.nav-btn {
  transition:
    transform 0.2s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.2s ease,
    margin-left 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    margin-right 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.nav-btn:active {
  transform: scale(0.97);
  transition-duration: 0.1s;
}
</style>