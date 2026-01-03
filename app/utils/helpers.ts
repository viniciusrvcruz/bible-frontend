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

/**
 * Checks if an input or textarea element is currently focused.
 * Also checks for contenteditable elements.
 */
export function isInputFocused(): boolean {
  const activeElement = document.activeElement
  if (!activeElement) return false

  const tagName = activeElement.tagName.toLowerCase()
  const isInput = tagName === 'input' || tagName === 'textarea'
  const isContentEditable = activeElement.getAttribute('contenteditable') === 'true'

  return isInput || isContentEditable
}

