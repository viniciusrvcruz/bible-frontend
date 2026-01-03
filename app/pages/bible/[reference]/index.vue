<script setup lang="ts">
import { useChapterService } from '~/composables/services/useChapterService'
import { getBookName, BookName } from '~/utils/book'

const route = useRoute()

const versionStore = useVersionStore()
const chapterService = useChapterService()

const reference = route.params.reference

const [
  bookParam,
  chapterParam,
  versionNameParam
] = reference?.toString().split('.') ?? []

const book = getBookName(bookParam ?? '') ?? BookName.gen
const chapter = parseInt(chapterParam ?? '1')
const version = versionNameParam
  ? versionStore.getVersionByName(versionNameParam)
  : versionStore.currentVersion

if (!version) {
  throw createError({ statusCode: 404, statusMessage: 'A versão não foi encontrada'})
}

if (version.id !== versionStore.currentVersion?.id) {
  versionStore.setCurrentVersion(version)
}

const chapterData = await chapterService.show(book, chapter, version.id)

if (!chapterData) {
  throw createError({ statusCode: 404, statusMessage: 'O capítulo não foi encontrado'})
}


</script>

<template>
  <main class="flex-1 flex justify-between">
    <BibleVerseSelectorResponsivePanel :current-book="book" />

    <BibleChapter :chapter="chapterData" />

    <!-- TODO: Add selected verses section -->
  </main>
</template>