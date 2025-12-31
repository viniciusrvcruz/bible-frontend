<script setup lang="ts">
import type { BookNameType } from '~/utils/book';
import type { Chapter } from '~/types/chapter/Chapter.type'
import type { Version } from '~/types/version/Version.type'

const props = defineProps<{
  chapter: Chapter
}>()

const route = useRoute()
const { goToChapter } = useNavigateToBible()
const versionStore = useVersionStore()

const historyModalRef = ref()
const versionModalRef = ref()
const focusedVerseId = ref<string | null>(null)
const isFocusActive = ref(false)
const isScrollingFromProgrammatic = ref(false)
const chapterContainerRef = ref<HTMLElement | null>(null)
const overlayHeight = ref(0)

// Manage font configuration cookies (already reactive)
const fontSizeCookie = useCookie<string>('bible-font-size', { default: () => 'text-lg' })
const fontFamilyCookie = useCookie<string>('bible-font-family', { default: () => 'font-sans' })

const bookName = computed(() => {
  return getBookInfo(props.chapter.book.name as BookNameType).name
})

watch(() => route.hash, (newHash) => {
  if (!newHash) {
    clearFocus()
    return
  }

  const verseId = newHash.slice(1)
  const verseNumber = parseInt(verseId.slice(1))

  // Check if verse is not 1 and if there's scroll in the div
  const container = chapterContainerRef.value
  const hasScroll = container ? container.scrollHeight > container.clientHeight : false
  
  if (verseNumber === 1 || !hasScroll) {
    focusedVerseId.value = null
    isFocusActive.value = false
    return
  }

  focusedVerseId.value = verseId
  isFocusActive.value = true
  isScrollingFromProgrammatic.value = true
  updateOverlayHeight()

  document.getElementById(verseId)?.scrollIntoView({ behavior: 'smooth' })

  // Remove flag after scroll animation ends
  setTimeout(() => {
    isScrollingFromProgrammatic.value = false
  }, 1000)
})

onMounted(() => {
  if (import.meta.client) {
    addCurrentChapterToHistory()
    initializeVerseFocus()

    // Update overlay height when window is resized
    window.addEventListener('resize', updateOverlayHeight)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('resize', updateOverlayHeight)
  }
})

const handleVersionSelect = async (version: Version) => {
  versionStore.setCurrentVersion(version)

  await goToChapter(props.chapter.book.name, props.chapter.number)
}

const clearFocus = () => {
  focusedVerseId.value = null
  isFocusActive.value = false

  if (route.hash) {
    history.replaceState(history.state, '', route.path)
  }
}

const handleOverlayClick = () => {
  clearFocus()
}

const handleScroll = () => {
  // Ignore scroll if caused by programmatic scrollIntoView
  if (isScrollingFromProgrammatic.value) {
    return
  }

  if (isFocusActive.value) {
    clearFocus()
  }
}

const goToPreviousChapter = () => {
  if (!props.chapter.previous) return

  goToChapter(props.chapter.previous.book.name, props.chapter.previous.number)
}

const goToNextChapter = () => {
  if (!props.chapter.next) return

  goToChapter(props.chapter.next.book.name, props.chapter.next.number)
}

const addCurrentChapterToHistory = () => {
  const verseNumber = route.hash ? parseInt(route.hash.slice(2)) : undefined

  historyModalRef.value?.addToHistory({
    book: props.chapter.book.name,
    chapter: props.chapter.number,
    verse: verseNumber,
    versionName: versionStore.currentVersion?.name ?? '',
    timestamp: Date.now()
  })
}

const updateOverlayHeight = () => {
  nextTick(() => {
    if (chapterContainerRef.value) {
      overlayHeight.value = chapterContainerRef.value.scrollHeight
    }
  })
}

const initializeVerseFocus = () => {
  if(!route.hash) return

  const verseId = route.hash.slice(1)
  const verseNumber = parseInt(verseId.slice(1))

  // Check if verse is not 1 and if there's scroll in the div
  const container = chapterContainerRef.value
  const hasScroll = container ? container.scrollHeight > container.clientHeight : false

  if (verseNumber === 1 || !hasScroll) {
    focusedVerseId.value = null
    isFocusActive.value = false
    return
  }

  focusedVerseId.value = verseId
  isFocusActive.value = true
  isScrollingFromProgrammatic.value = true
  updateOverlayHeight()

  document.getElementById(verseId)?.scrollIntoView({ behavior: 'smooth' })

  // Remove flag after scroll animation ends
  setTimeout(() => {
    isScrollingFromProgrammatic.value = false
  }, 1000)
}

</script>

<template>
  <section class="flex-1 flex flex-col justify-between h-screen-header overflow-hidden">
    <div 
      ref="chapterContainerRef"
      class="flex flex-col overflow-y-auto h-full scroll-smooth relative"
      @scroll="handleScroll"
    >
      <!-- Header with buttons -->
      <div class="navbar py-2.5 px-5 bg-base-100 shadow-sm sticky top-0 items-center z-20 lg:px-10">
        <span class="hidden font-bold text-xl lg:inline">
          {{ bookName }} {{ chapter.number }}
        </span>

        <div class="ms-auto space-x-2 flex items-center">
          <!-- History button -->
          <button
            v-tooltip.bottom="'Histórico de versículos'"
            class="btn btn-sm"
            @click="historyModalRef?.open()"
          >
            <Icon icon="history" :size="20" />
          </button>

          <!-- Font configuration button -->
          <BibleChapterFontConfigDropdown
            v-model:font-size="fontSizeCookie"
            v-model:font-family="fontFamilyCookie"
          />

          <!-- Version button -->
          <button
            v-tooltip.bottom="'Selecionar versão'"
            class="btn btn-sm"
            @click="versionModalRef?.open()"
          >
            <Icon icon="globe" :size="20" />
            <span class="font-bold">
              {{ versionStore.currentVersion?.name ?? '-' }}
            </span>
          </button>
        </div>
      </div>

      <!-- Focus overlay (only in chapter section) -->
      <div 
        v-if="isFocusActive"
        class="absolute top-0 left-0 right-0 bg-black/20 z-10 cursor-pointer transition-opacity duration-300 ease-in-out"
        :style="{ height: `${overlayHeight}px` }"
        @click="handleOverlayClick"
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
            'max-w-4xl mx-auto text-justify',
            fontSizeCookie,
            fontFamilyCookie
          ]"
        >
          <p
            v-for="verse in chapter.verses"
            :key="verse.id"
            :id="`v${verse.number}`"
            class="px-2 py-1 block leading-[1.9] indent-0 cursor-pointer transition-all duration-200 ease-in-out mb-4"
            :class="{
              'relative z-20 bg-base-100 rounded shadow-lg': isFocusActive && focusedVerseId === `v${verse.number}`,
              'hover:bg-base-200/50 rounded px-1': !isFocusActive
            }"
          >
            <sup class="text-[0.8em] align-super leading-0 font-bold text-base-content/50 me-2">
              {{ verse.number }}
            </sup>
            <span class="leading-[1.9]">
              {{ verse.text }}
            </span>
          </p>
        </div>
        
        <!-- Copyright -->
        <div 
          v-if="chapter.version?.copyright"
          class="mt-12 mb-6 text-center text-sm text-base-content/60 max-w-4xl mx-auto"
          v-html="chapter.version.copyright"
        />
        
        <!-- Divider and Footer -->
        <hr class="my-8 border-base-300 max-w-4xl mx-auto" />
        
        <footer class="pb-8 text-center text-sm text-base-content/70 max-w-4xl mx-auto">
          <p class="mb-3">
            Este é um projeto open source dedicado a tornar a leitura da Bíblia mais acessível e moderna.
          </p>
          <div class="flex items-center justify-center gap-4">
            <a
              href="https://github.com/viniciusrvcruz/bible-frontend"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 text-inherit underline hover:text-primary hover:opacity-80 transition-colors"
              title="Repositório do Projeto no GitHub"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>Repositório</span>
            </a>
            <span class="text-base-content/40">•</span>
            <a
              href="https://www.linkedin.com/in/viniciuscruz7"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 text-inherit underline hover:text-primary hover:opacity-80 transition-colors"
              title="LinkedIn"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              <span>Vinicius Cruz</span>
            </a>
          </div>
        </footer>
      </div>

      <!-- Navigation buttons -->
      <div class="flex justify-between sticky bottom-0 w-full pointer-events-none">
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

    <BibleChapterHistoryModal ref="historyModalRef" />
    <BibleChapterVersionModal
      ref="versionModalRef"
      @select="handleVersionSelect"
    />
  </section>
</template>
