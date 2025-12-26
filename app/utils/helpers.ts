/**
 * Normalizes a string by removing accents, converting to lowercase, and removing spaces.
 * Useful for comparisons and search filters.
 */
export function normalizeString(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '')
}

