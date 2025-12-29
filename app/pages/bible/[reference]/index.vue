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

    <section class="hidden h-40 fixed left-0 bottom-0 right-0 bg-blue-500 lg:relative lg:w-2/6 lg:h-auto">
      Seleted verses
    </section>
  </main>
</template>