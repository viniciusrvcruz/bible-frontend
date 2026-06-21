import { describe, expect, it } from 'vitest'
import { matchesBookSearchIncludes, matchesBookSearchPrefix } from '~/utils/bible/bookSearch'

describe('matchesBookSearchPrefix', () => {
  it('ignores accents when the query has none', () => {
    expect(matchesBookSearchPrefix('Gênesis', 'gen')).toBe(true)
    expect(matchesBookSearchPrefix('João', 'joao')).toBe(true)
    expect(matchesBookSearchPrefix('1 Samuel', '1 sam')).toBe(true)
  })

  it('respects accents when the query includes them', () => {
    expect(matchesBookSearchPrefix('Gênesis', 'gên')).toBe(true)
    expect(matchesBookSearchPrefix('Gênesis', 'gé')).toBe(false)
    expect(matchesBookSearchPrefix('João', 'joã')).toBe(true)
    expect(matchesBookSearchPrefix('João', 'joa')).toBe(true)
    expect(matchesBookSearchPrefix('João', 'joá')).toBe(false)
  })

  it('returns false for empty queries', () => {
    expect(matchesBookSearchPrefix('Gênesis', '')).toBe(false)
  })

  it('does not match when the query is not a prefix of the book name', () => {
    expect(matchesBookSearchPrefix('Gênesis', 'esis')).toBe(false)
    expect(matchesBookSearchPrefix('Gênesis', 'nesis')).toBe(false)
    expect(matchesBookSearchPrefix('João', 'ao')).toBe(false)
  })
})

describe('matchesBookSearchIncludes', () => {
  it('ignores accents when the query has none', () => {
    expect(matchesBookSearchIncludes('1 Samuel', 'samuel')).toBe(true)
    expect(matchesBookSearchIncludes('João', 'oao')).toBe(true)
  })

  it('respects accents when the query includes them', () => {
    expect(matchesBookSearchIncludes('João', 'oão')).toBe(true)
    expect(matchesBookSearchIncludes('João', 'oáo')).toBe(false)
  })

  it('returns false for empty queries', () => {
    expect(matchesBookSearchIncludes('Gênesis', '')).toBe(false)
  })
})
