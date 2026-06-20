import { describe, expect, it } from 'vitest'
import { buildChapterUrl } from '~/utils/bible/chapterUrl'

describe('buildChapterUrl', () => {
  it('uses an explicit version abbreviation when provided', () => {
    expect(buildChapterUrl('gen', 1, { versionAbbreviation: 'acf' }))
      .toBe('/bible/gen.1.acf')
  })

  it('falls back to the default version when abbreviation is omitted', () => {
    expect(buildChapterUrl('gen', 1, { defaultVersionAbbreviation: 'nvi' }))
      .toBe('/bible/gen.1.nvi')
  })

  it('appends a verse hash when verse is greater than 1', () => {
    expect(buildChapterUrl('gen', 1, { versionAbbreviation: 'nvi', verse: 5 }))
      .toBe('/bible/gen.1.nvi#v5')
  })

  it('omits the verse hash when verse is 1 or undefined', () => {
    expect(buildChapterUrl('gen', 1, { versionAbbreviation: 'nvi', verse: 1 }))
      .toBe('/bible/gen.1.nvi')
    expect(buildChapterUrl('gen', 1, { versionAbbreviation: 'nvi' }))
      .toBe('/bible/gen.1.nvi')
  })

  it('builds the URL with an unknown abbreviation without validating it', () => {
    expect(buildChapterUrl('gen', 1, { versionAbbreviation: 'foo' }))
      .toBe('/bible/gen.1.foo')
  })

  it('omits the version suffix when no abbreviation is available', () => {
    expect(buildChapterUrl('gen', 1)).toBe('/bible/gen.1')
  })

  it('prefers an explicit abbreviation over the default version', () => {
    expect(buildChapterUrl('gen', 1, {
      versionAbbreviation: 'acf',
      defaultVersionAbbreviation: 'nvi',
    })).toBe('/bible/gen.1.acf')
  })
})

describe('goToChapterInVersion contract', () => {
  it('navigates with the URL built from the given version and verse', () => {
    const url = buildChapterUrl('gen', 3, { versionAbbreviation: 'acf', verse: 7 })

    expect(url).toBe('/bible/gen.3.acf#v7')
  })
})
