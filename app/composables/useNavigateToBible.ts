export const useNavigateToBible = () => {
  const versionStore = useVersionStore()

  const goToChapter = async (
    book: string,
    chapter: number,
    verse?: number,
    replace: boolean = false,
  ) => {
    const version = versionStore.currentVersion
      ? `.${versionStore.currentVersion.name}`
      : ''
    const hash = verse && verse > 1
      ? `#v${verse}`
      : undefined

    await navigateTo({
      path: `/bible/${book}.${chapter}${version}`,
      hash,
      replace,
    })
  }

  return { goToChapter }
}

