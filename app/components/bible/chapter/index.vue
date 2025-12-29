<script setup lang="ts">
import type { BookNameType } from '~/utils/book';
import type { Chapter } from '~/types/chapter/Chapter.type'

const props = defineProps<{
  chapter: Chapter
}>()

const route = useRoute()
const { goToChapter } = useNavigateToBible()

const versionStore = useVersionStore()

const bookName = computed(() => {
  return getBookInfo(props.chapter.book.name as BookNameType).name
})

onMounted(() => {
  if (!route.hash) return

  document.getElementById(route.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
  history.replaceState(history.state, '', route.path)
})

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
    <div class="flex flex-col overflow-y-auto h-full chapter-container">
      <div class="navbar py-2.5 px-5 bg-base-100 shadow-sm sticky top-0 items-center lg:px-10">
        <span class="hidden font-bold text-xl lg:inline">
          {{ bookName }} {{ chapter.number }}
        </span>

        <div class="ms-auto space-x-2">
          <button class="btn btn-sm">
            <Icon icon="history" :size="20" />
          </button>
          <button class="btn btn-sm">
            <Icon icon="letter_case" :size="20" />
          </button>
          <button class="btn btn-sm">
            <Icon icon="globe" :size="20" />
            <span class="font-bold">
              {{ versionStore.currentVersion?.name ?? '-' }}
            </span>
          </button>
        </div>
      </div>

      <div class="px-10 flex-1">
        <h1 class="text-xl font-bold text-center text-base-content/40 mt-2">
          {{ bookName }}
        </h1>
        <h2 class="text-7xl font-bold text-center mb-10">
          {{ chapter.number }}
        </h2>
        <pre class="text-wrap">
          <span
            v-for="verse in chapter.verses"
            :key="verse.id"
            :id="`v${verse.number}`"
          >
            {{ verse.number }} {{ verse.text }}
          </span>
        </pre>
      </div>

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
          class="btn text-sm flex-1 mx-5 px-0 py-7 pointer-events-auto sm:text-lg lg:hidden"
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

  </section>
</template>

<style scoped>
.chapter-container {
  scroll-behavior: smooth;
}
</style>