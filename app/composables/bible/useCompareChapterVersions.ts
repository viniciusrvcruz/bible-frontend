import type { BookAbbreviationType } from '~/utils/bible/book'
import type { Chapter } from '~/types/chapter/Chapter.type'
import { useChapterService } from '~/composables/services/useChapterService'
import { stripVersePlaceholders } from '~/utils/bible/versePlaceholders'

export type VersionChapterState =
  | { status: 'loading' }
  | { status: 'loaded'; chapter: Chapter }
  | { status: 'error' }

export function useCompareChapterVersions(
  book: MaybeRefOrGetter<BookAbbreviationType>,
  chapter: MaybeRefOrGetter<number>,
) {
  const chapterService = useChapterService()

  const chaptersByVersionId = reactive(new Map<number, VersionChapterState>())

  const getVersionState = (versionId: number): VersionChapterState | undefined =>
    chaptersByVersionId.get(versionId)

  const loadVersion = (versionId: number) => {
    const current = chaptersByVersionId.get(versionId)

    if (current?.status === 'loading' || current?.status === 'loaded') return

    chaptersByVersionId.set(versionId, { status: 'loading' })

    chapterService.show(toValue(book), toValue(chapter), versionId)
      .then(chapterData => {
        chaptersByVersionId.set(versionId, {
          status: 'loaded',
          chapter: chapterData
        })
      })
      .catch(() => {
        chaptersByVersionId.set(versionId, { status: 'error' })
      })
  }

  const getVersePlainText = (versionId: number, verseNumber: number): string | null => {
    const state = chaptersByVersionId.get(versionId)
    if (state?.status !== 'loaded') return null

    const verse = state.chapter.verses.find(verse => verse.number === verseNumber)
    if (!verse) return null

    return stripVersePlaceholders(verse.text)
  }

  return {
    chaptersByVersionId,
    getVersionState,
    loadVersion,
    getVersePlainText,
  }
}
