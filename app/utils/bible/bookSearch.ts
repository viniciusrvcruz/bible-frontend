import { normalizeString } from '~/utils/helpers'

type BookSearchMatch = 'prefix' | 'includes'

function hasDiacritics(str: string): boolean {
  return /[\u0300-\u036f]/.test(str.normalize('NFD'))
}

function prepareSearchString(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '')
}

function matchesBookSearch(text: string, query: string, match: BookSearchMatch): boolean {
  if (!query) return false

  if (hasDiacritics(query)) {
    const normalizedText = prepareSearchString(text)
    const normalizedQuery = prepareSearchString(query)

    return match === 'prefix'
      ? normalizedText.startsWith(normalizedQuery)
      : normalizedText.includes(normalizedQuery)
  }

  const normalizedText = normalizeString(text)
  const normalizedQuery = normalizeString(query)

  return match === 'prefix'
    ? normalizedText.startsWith(normalizedQuery)
    : normalizedText.includes(normalizedQuery)
}

/**
 * Matches a book name against a search query prefix.
 * Ignores accents when the query has none; preserves them when the query includes diacritics.
 */
export function matchesBookSearchPrefix(text: string, query: string): boolean {
  return matchesBookSearch(text, query, 'prefix')
}

/**
 * Matches a book name when the search query appears anywhere in the name.
 * Uses the same accent rules as {@link matchesBookSearchPrefix}.
 */
export function matchesBookSearchIncludes(text: string, query: string): boolean {
  return matchesBookSearch(text, query, 'includes')
}
