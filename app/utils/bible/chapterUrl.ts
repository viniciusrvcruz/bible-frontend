export type BuildChapterUrlOptions = {
  versionAbbreviation?: string
  defaultVersionAbbreviation?: string
  verse?: number
}

export function buildChapterUrl(
  book: string,
  chapter: number,
  options: BuildChapterUrlOptions = {},
): string {
  const version =
    options.versionAbbreviation ??
    options.defaultVersionAbbreviation ??
    ''
  const versionSuffix = version ? `.${version}` : ''

  const path = `/bible/${book}.${chapter}${versionSuffix}`
  const hash =
    options.verse !== undefined && options.verse > 1
      ? `#v${options.verse}`
      : ''

  return `${path}${hash}`
}
