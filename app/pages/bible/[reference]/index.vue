<script setup lang="ts">
import { useChapterService } from '~/composables/services/useChapterService'
import { useBookService } from '~/composables/services/useBookService'
import { getBookAbbreviation, BookAbbreviation } from '~/utils/book'

const route = useRoute()

const versionStore = useVersionStore()
const chapterService = useChapterService()
const bookService = useBookService()

const reference = route.params.reference

const [
  bookParam,
  chapterParam,
  versionNameParam
] = reference?.toString().split('.') ?? []

const book = getBookAbbreviation(bookParam ?? '') ?? BookAbbreviation.jhn
const chapter = parseInt(chapterParam ?? '1')
const version = versionNameParam
  ? versionStore.getVersionByAbbreviation(versionNameParam)
  : versionStore.currentVersion

if (!version) {
  throw createAppError('A versão não foi encontrada')
}

if (version.id !== versionStore.currentVersion?.id) {
  versionStore.setCurrentVersion(version)
  // Load books for the new version
  const books = await bookService.index(version.id)
  versionStore.setCurrentVersionBooks(books)
}

const { data: chapterData } = await chapterService.useShow(book, chapter, version.id)

if (!chapterData.value) {
  throw createAppError('O capítulo não foi encontrado')
}

</script>

<template>
  <main class="flex-1 flex justify-between">
    <BibleVerseSelectorResponsivePanel :current-book="book" />

    <BibleChapter v-if="chapterData" :chapter="chapterData" />

    <!-- TODO: Add selected verses section -->
  </main>
</template>