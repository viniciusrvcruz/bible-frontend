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

const bookName = computed(() => {
  return getBookInfo(props.chapter.book.name as BookNameType).name
})

const historyModalRef = ref()
const isVersionModalOpen = ref(false)
const selectedFontSize = ref('text-lg')
const selectedFontFamily = ref('font-sans')
const focusedVerseId = ref<string | null>(null)
const isFocusActive = ref(false)

const handleVersionSelect = async (version: Version) => {
  versionStore.setCurrentVersion(version)
  await goToChapter(props.chapter.book.name, props.chapter.number, undefined, true)
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

const loadFontSettings = () => {
  const storedSize = localStorage.getItem('bible-font-size')
  const storedFamily = localStorage.getItem('bible-font-family')
  
  if (storedSize) selectedFontSize.value = storedSize
  if (storedFamily) selectedFontFamily.value = storedFamily
}

const addCurrentChapterToHistory = () => {
  const verseNumber = route.hash ? parseInt(route.hash.slice(2)) : undefined

  historyModalRef.value?.addToHistory({
    book: props.chapter.book.name,
    bookName: bookName.value,
    chapter: props.chapter.number,
    verse: verseNumber,
    versionName: versionStore.currentVersion?.name ?? '',
    timestamp: Date.now()
  })
}

const initializeVerseFocus = () => {
  if (route.hash) {
    const verseId = route.hash.slice(1)
    focusedVerseId.value = verseId
    isFocusActive.value = true

    setTimeout(() => {
      document.getElementById(verseId)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }
}

onMounted(() => {
  if (import.meta.client) {
    loadFontSettings()
    addCurrentChapterToHistory()
    initializeVerseFocus()
  }
})

watch(selectedFontSize, (newSize) => {
  if (import.meta.client) {
    localStorage.setItem('bible-font-size', newSize)
  }
})

watch(selectedFontFamily, (newFamily) => {
  if (import.meta.client) {
    localStorage.setItem('bible-font-family', newFamily)
  }
})

watch(() => route.hash, (newHash) => {
  if (!newHash) {
    clearFocus()
    return
  }
  
  const verseId = newHash.slice(1)
  focusedVerseId.value = verseId
  isFocusActive.value = true
  
  setTimeout(() => {
    document.getElementById(verseId)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, 100)
})

</script>

<template>
  <section class="flex-1 flex flex-col justify-between h-screen-header overflow-hidden">
    <div 
      class="flex flex-col overflow-y-auto h-full chapter-container relative"
      @scroll="handleScroll"
    >
      <!-- Header com botões -->
      <div class="navbar py-2.5 px-5 bg-base-100 shadow-sm sticky top-0 items-center z-20 lg:px-10">
        <span class="hidden font-bold text-xl lg:inline">
          {{ bookName }} {{ chapter.number }}
        </span>

        <div class="ms-auto space-x-2 flex items-center">
          <!-- Botão Histórico -->
          <button
            class="btn btn-sm"
            @click="historyModalRef?.open()"
            title="Histórico de versículos"
          >
            <Icon icon="history" :size="20" />
          </button>
          
          <!-- Popover Configurações de Fonte -->
          <BibleChapterFontConfigPopover 
            v-model:font-size="selectedFontSize"
            v-model:font-family="selectedFontFamily"
          />
          
          <!-- Botão Versão -->
          <button 
            class="btn btn-sm"
            @click="isVersionModalOpen = true"
            title="Selecionar versão"
          >
            <Icon icon="globe" :size="20" />
            <span class="font-bold">
              {{ versionStore.currentVersion?.name ?? '-' }}
            </span>
          </button>
        </div>
      </div>

      <!-- Overlay de foco (apenas na section do chapter) -->
      <div 
        v-if="isFocusActive"
        class="absolute inset-0 bg-black/40 z-10 cursor-pointer"
        @click="handleOverlayClick"
      ></div>

      <!-- Conteúdo Principal -->
      <div class="px-5 flex-1 sm:px-10 lg:px-20">
        <h1 class="text-xl font-bold text-center text-base-content/60 mt-6 mb-2">
          {{ bookName }}
        </h1>
        <h2 class="text-6xl font-bold text-center mb-8 sm:text-7xl">
          {{ chapter.number }}
        </h2>
        
        <div 
          :class="[
            'max-w-4xl mx-auto bible-text',
            selectedFontSize,
            selectedFontFamily
          ]"
        >
          <p
            v-for="verse in chapter.verses"
            :key="verse.id"
            :id="`v${verse.number}`"
            class="verse-item cursor-pointer transition-all mb-4"
            :class="{
              'relative z-20 bg-base-100 rounded px-2 py-1 shadow-lg': isFocusActive && focusedVerseId === `v${verse.number}`,
              'hover:bg-base-200/50 rounded px-1': !isFocusActive
            }"
          >
            <sup class="verse-number font-bold text-primary me-2">{{ verse.number }}</sup>
            <span class="verse-text">{{ verse.text }}</span>
          </p>
        </div>
        
        <!-- Copyright -->
        <div 
          v-if="chapter.version?.copyright"
          class="mt-12 mb-6 text-center text-sm text-base-content/60 max-w-4xl mx-auto"
          v-html="chapter.version.copyright"
        ></div>
        
        <!-- Divisor e Footer -->
        <hr class="my-8 border-base-300 max-w-4xl mx-auto" />
        
        <footer class="pb-8 text-center text-sm text-base-content/70 max-w-4xl mx-auto">
          <p class="mb-3">
            Este é um projeto open source dedicado a tornar a leitura da Bíblia mais acessível e moderna.
          </p>
          <div class="flex items-center justify-center gap-4">
            <a
              href="https://github.com/seu-usuario/bible-frontend"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 hover:text-primary transition-colors"
              title="Projeto no GitHub"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>GitHub</span>
            </a>
            <span class="text-base-content/40">•</span>
            <a
              href="https://www.linkedin.com/in/viniciuscruz7"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 hover:text-primary transition-colors"
              title="LinkedIn"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              <span>LinkedIn</span>
            </a>
          </div>
        </footer>
      </div>

      <!-- Botões de Navegação -->
      <div class="flex justify-between sticky bottom-0 w-full pointer-events-none">
        <button
          v-if="chapter.previous"
          class="btn btn-xl btn-circle mb-15 ms-5 border-2 border-base-300 shadow-sm pointer-events-auto lg:mb-20 lg:ms-10"
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
          class="btn btn-xl btn-circle mb-15 me-5 border-2 border-base-300 shadow-sm pointer-events-auto lg:mb-20 lg:me-10 lg:ms-auto"
          @click="goToNextChapter"
        >
          <Icon icon="chevron_right" />
        </button>
      </div>
    </div>

    <!-- Modais -->
    <BibleChapterHistoryModal ref="historyModalRef" />

    <BibleChapterVersionModal 
      v-model:is-open="isVersionModalOpen"
      @select="handleVersionSelect"
    />
  </section>
</template>

<style scoped>
.chapter-container {
  scroll-behavior: smooth;
}

.bible-text {
  text-align: justify;
  text-justify: inter-word;
}

.verse-item {
  display: block;
  line-height: 1.9;
  text-indent: 0;
}

.verse-number {
  font-size: 0.7em;
  vertical-align: super;
  line-height: 0;
  font-weight: 700;
}

.verse-text {
  line-height: 1.9;
}

/* Smooth transitions */
.transition-all {
  transition: all 0.2s ease-in-out;
}

/* Overlay de foco */
.absolute.inset-0 {
  transition: opacity 0.3s ease-in-out;
}

/* Copyright HTML styling */
footer a {
  color: inherit;
  text-decoration: underline;
}

footer a:hover {
  opacity: 0.8;
}

/* Fontes personalizadas */
:deep(.font-arial) {
  font-family: Arial, Helvetica, sans-serif;
}

:deep(.font-times) {
  font-family: 'Times New Roman', Times, serif;
}

:deep(.font-verdana) {
  font-family: Verdana, Geneva, sans-serif;
}

:deep(.font-georgia) {
  font-family: Georgia, 'Times New Roman', serif;
}

:deep(.font-courier) {
  font-family: 'Courier New', Courier, monospace;
}
</style>
