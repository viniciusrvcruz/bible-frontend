export const useNavigateToBible = () => {
  const versionStore = useVersionStore()

  const getChapterUrl = (book: string, chapter: number) => {
    const version = versionStore.currentVersion
      ? `.${versionStore.currentVersion.abbreviation}`
      : ''

    return `/bible/${book}.${chapter}${version}`
  }

  const goToChapter = async (
    book: string,
    chapter: number,
    verse?: number,
    replace: boolean = false,
  ) => {
    const hash = verse && verse > 1
      ? `#v${verse}`
      : undefined

    await navigateTo({
      path: getChapterUrl(book, chapter),
      hash,
      replace,
    })
  }

  return { goToChapter, getChapterUrl }
}

