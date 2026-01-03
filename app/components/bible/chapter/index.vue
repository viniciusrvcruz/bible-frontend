<script setup lang="ts">
import type { Chapter } from '~/types/chapter/Chapter.type'
import type { Version } from '~/types/version/Version.type'
import { useVerseFocus } from '~/composables/bible/useVerseFocus'
import { useChapterHistory } from '~/composables/bible/useChapterHistory'

const props = defineProps<{
  chapter: Chapter
}>()

const route = useRoute()
const { goToChapter } = useNavigateToBible()
const versionStore = useVersionStore()
const { addToHistory } = useChapterHistory()

const chapterContainerRef = ref<HTMLElement | null>(null)

const fontSize = useCookie<string>('bible-font-size', { default: () => 'text-lg' })
const fontFamily = useCookie<string>('bible-font-family', { default: () => 'font-sans' })

const bookName = computed(() => {
  return getBookInfo(props.chapter.book.name).name
})

const verseNumber = computed(() => {
  if (!route.hash) return null

  return parseInt(route.hash.slice(2))
})

const clearHash = () => {
  history.replaceState(history.state, '', route.path)
}

const {
  focusedVerseNumber,
  overlayHeight,
  handleScroll,
  handleVerseFocus,
  clearFocus
} = useVerseFocus(chapterContainerRef, verseNumber, clearHash)

onMounted(() => {
  if(!import.meta.client) return

  addCurrentChapterToHistory()
  handleVerseFocus()
})

const addCurrentChapterToHistory = () => {
  const verseNumber = route.hash ? parseInt(route.hash.slice(2)) : undefined

  addToHistory({
    book: props.chapter.book.name,
    chapter: props.chapter.number,
    verse: verseNumber,
    versionName: versionStore.currentVersion?.name ?? '',
    timestamp: Date.now()
  })
}

const handleVersionSelect = async (version: Version) => {
  versionStore.setCurrentVersion(version)

  await goToChapter(props.chapter.book.name, props.chapter.number)
}

const goToPreviousChapter = () => {
  if (!props.chapter.previous) return

  goToChapter(props.chapter.previous.book.name, props.chapter.previous.number)
}

const goToNextChapter = () => {
  if (!props.chapter.next) return

  goToChapter(props.chapter.next.book.name, props.chapter.next.number)
}

</script>

<template>
  <section class="flex-1 flex flex-col justify-between h-screen-header overflow-hidden">
    <div
      ref="chapterContainerRef"
      class="flex flex-col overflow-y-auto h-full scroll-smooth relative"
      @scroll="handleScroll"
    >
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
      <div class="px-5 flex-1 sm:px-10 lg:px-20">
        <h1 class="text-xl font-bold text-center text-base-content/60 mt-6 mb-2">
          {{ bookName }}
        </h1>
        <h2 class="text-6xl font-bold text-center mb-8 sm:text-7xl">
          {{ chapter.number }}
        </h2>

        <div 
          :class="[
            'max-w-2xl mx-auto text-justify',
            fontSize,
            fontFamily
          ]"
        >
          <BibleChapterVerse
            v-for="verse in chapter.verses"
            :key="verse.id"
            :id="`v${verse.number}`"
            :verse="verse"
            :is-focused="verse.number === focusedVerseNumber"
            :is-focus-active="!!focusedVerseNumber"
          />
        </div>

        <!-- Version Copyright -->
        <div 
          v-if="versionStore.currentVersion?.copyright"
          class="mt-12 mb-6 text-center text-sm text-base-content/60 max-w-4xl mx-auto"
          v-html="versionStore.currentVersion.copyright"
        />

        <div class="divider my-8" />

        <BibleChapterFooter />
      </div>

      <!-- Navigation buttons -->
      <div class="flex justify-between sticky bottom-0 w-full pointer-events-none z-2">
        <button
          v-if="chapter.previous"
          class="btn btn-xl btn-circle mb-15 ms-5 border-2 border-base-300 shadow-sm pointer-events-auto lg:ms-10 lg:mb-40"
          @click="goToPreviousChapter"
        >
          <Icon icon="chevron_left" />
        </button>
  
        <label
          for="select_verse_modal"
          class="btn text-sm flex-1 mx-2 sm:mx-5 px-0 py-7 border-2 border-base-300 pointer-events-auto sm:text-lg lg:hidden"
        >
          {{ bookName }} {{ chapter.number }}
        </label>

        <button
          v-if="chapter.next"
          class="btn btn-xl btn-circle mb-15 me-5 border-2 border-base-300 shadow-sm pointer-events-auto lg:me-10 lg:ms-auto lg:mb-40"
          @click="goToNextChapter"
        >
          <Icon icon="chevron_right" />
        </button>
      </div>
    </div>
  </section>
</template>
