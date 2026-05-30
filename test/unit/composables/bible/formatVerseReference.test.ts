import { describe, expect, it } from 'vitest'
import { formatVerseReference } from '~/composables/bible/useSelectedVerses'

describe('formatVerseReference', () => {
  it('returns an empty string for no verses', () => {
    expect(formatVerseReference([])).toBe('')
  })

  it('formats a single verse', () => {
    expect(formatVerseReference([3])).toBe('3')
  })

  it('groups consecutive verses into ranges', () => {
    expect(formatVerseReference([1, 2, 3])).toBe('1-3')
  })

  it('separates non-consecutive groups', () => {
    expect(formatVerseReference([1, 2, 3, 5, 6, 10])).toBe('1-3,5-6,10')
  })

  it('sorts unsorted input', () => {
    expect(formatVerseReference([5, 1, 3, 2])).toBe('1-3,5')
  })
})
