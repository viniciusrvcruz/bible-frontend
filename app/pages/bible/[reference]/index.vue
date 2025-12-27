<script setup lang="ts">
import { useChapterService } from '~/composables/services/useChapterService'
import { BookNameEnum } from '~/types/book/Book.enum'

const route = useRoute()

const versionStore = useVersionStore()
const chapterService = useChapterService()

const reference = route.params.reference

const [
  bookParam,
  chapterParam,
  versionNameParam
] = reference?.toString().split('.') ?? []

const book = BookNameEnum[bookParam?.toUpperCase() as keyof typeof BookNameEnum] ?? BookNameEnum.GEN
const chapter = parseInt(chapterParam ?? '1')
const version = versionNameParam
  ? versionStore.getVersionByName(versionNameParam)
  : versionStore.currentVersion

if (!version) {
  throw navigateTo('/bible/chapter-not-found')
}

const chapterData = await chapterService.show(book, chapter, version.id)

if (!chapterData) {
  throw navigateTo('/bible/chapter-not-found')
}


</script>

<template>
  <main class="flex-1 flex justify-between">
    <BibleVerseSelectorResponsivePanel />

    <BibleChapter :chapter="chapterData" />

    <section class="hidden h-40 fixed left-0 bottom-0 right-0 bg-blue-500 lg:relative lg:w-2/6 lg:h-auto">
      Seleted verses
    </section>
  </main>2
</template>