import { describe, expect, it } from 'vitest'
import { normalizeString } from '~/utils/helpers'

describe('normalizeString', () => {
  it('removes accents and lowercases text', () => {
    expect(normalizeString('Gênesis')).toBe('genesis')
  })

  it('removes whitespace', () => {
    expect(normalizeString('1 Samuel')).toBe('1samuel')
  })

  it('handles empty strings', () => {
    expect(normalizeString('')).toBe('')
  })
})
