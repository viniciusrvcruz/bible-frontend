import { BookAbbreviation } from '~/utils/bible/book'

export const useNavigateToBible = () => {
  const versionStore = useVersionStore()
  const lastChapterStore = useLastChapterStore()

  const lastChapterUrl = computed(() => {
    const lastChapter = lastChapterStore.parsedReference

    if (lastChapter) {
      return getChapterUrl(lastChapter.book, lastChapter.chapter, lastChapter.version)
    }

    return getChapterUrl(BookAbbreviation.jhn, 1)
  })

  const getChapterUrl = (
    book: string,
    chapter: number,
    versionAbbreviation?: string,
    verse?: number,
  ) => {
    const version =
      versionAbbreviation ??
      versionStore.currentVersion?.abbreviation ??
      ''
    const versionSuffix = version ? `.${version}` : ''

    const path = `/bible/${book}.${chapter}${versionSuffix}`
    const hash =
      verse !== undefined && verse > 1
        ? `#v${verse}`
        : ''

    return `${path}${hash}`
  }

  const goToChapter = async (
    book: string,
    chapter: number,
    verse?: number,
    replace: boolean = false,
  ) => {
    await navigateTo(getChapterUrl(book, chapter, undefined, verse), { replace })
  }

  const goToChapterInVersion = async (
    book: string,
    chapter: number,
    versionAbbreviation: string,
    verse?: number,
    replace: boolean = false,
  ) => {
    await navigateTo(
      getChapterUrl(book, chapter, versionAbbreviation, verse),
      { replace },
    )
  }

  const goToLastChapter = async (replace: boolean = false) => {
    const lastChapter = lastChapterStore.parsedReference

    if (lastChapter) {
      const url = getChapterUrl(
        lastChapter.book,
        lastChapter.chapter,
        lastChapter.version,
      )
      await navigateTo({ path: url, replace })
    } else {
      await goToChapter(BookAbbreviation.jhn, 1, 1, replace)
    }
  }

  return {
    lastChapterUrl,
    getChapterUrl,
    goToChapter,
    goToChapterInVersion,
    goToLastChapter,
  }
}

