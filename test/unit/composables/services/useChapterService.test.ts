import { describe, expect, it } from 'vitest'
import { chapterResourcePath } from '~/composables/services/useChapterService'

describe('chapterResourcePath', () => {
  it('builds the REST path for a chapter', () => {
    expect(chapterResourcePath('gen', 1, 42)).toBe(
      'versions/42/books/gen/chapters/1',
    )
  })

  it('accepts any valid book abbreviation', () => {
    expect(chapterResourcePath('jhn', 3, 7)).toBe(
      'versions/7/books/jhn/chapters/3',
    )
  })
})
