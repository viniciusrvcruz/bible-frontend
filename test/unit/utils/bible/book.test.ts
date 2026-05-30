import { describe, expect, it } from 'vitest'
import {
  BOOKS,
  getBookAbbreviation,
  getDefaultBookChapterCount,
  getDefaultBookName,
  isValidBookAbbreviation,
} from '~/utils/bible/book'

describe('book utilities', () => {
  it('validates known abbreviations', () => {
    expect(isValidBookAbbreviation('gen')).toBe(true)
    expect(isValidBookAbbreviation('invalid')).toBe(false)
  })

  it('resolves abbreviations case-insensitively', () => {
    expect(getBookAbbreviation('GEN')).toBe('gen')
    expect(getBookAbbreviation('unknown')).toBeUndefined()
  })

  it('returns metadata for a book', () => {
    expect(getDefaultBookName('gen')).toBe('Gênesis')
    expect(getDefaultBookChapterCount('gen')).toBe(50)
  })

  it('covers all 66 books', () => {
    expect(BOOKS).toHaveLength(66)
  })
})
