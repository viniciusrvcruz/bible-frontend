export const useVerseFocus = (
  containerRef: Ref<HTMLElement | null>,
  verseNumber: Ref<number | null> | ComputedRef<number | null>,
  onClearFocus?: () => void
) => {
  const focusedVerseNumber = ref<number | null>(null)
  let scrollTimeout: ReturnType<typeof setTimeout> | null = null
  let isScrollingToVerse = false

  const overlayHeight = computed(() => {
    if (!focusedVerseNumber.value || !containerRef.value) return 0

    return containerRef.value.scrollHeight
  })

  const resetScrollTimeout = () => {
    if (scrollTimeout) clearTimeout(scrollTimeout)

    scrollTimeout = setTimeout(() => {
      scrollTimeout = null
      isScrollingToVerse = false
    }, 150)
  }

  const clearFocus = () => {
    focusedVerseNumber.value = null

    if (verseNumber.value) onClearFocus?.()
  }

  const focusVerseByNumber = (targetVerseNumber: number, shouldScrollIntoVerse = true) => {
    if (!containerRef.value) return

    const verseElement = containerRef.value.querySelector(`#v${targetVerseNumber}`)
    if (!verseElement) return

    focusedVerseNumber.value = targetVerseNumber

    if (!shouldScrollIntoVerse) return

    isScrollingToVerse = true
    verseElement.scrollIntoView({ behavior: 'smooth' })
    resetScrollTimeout()
  }

  const focusVerse = () => {
    if (!verseNumber.value || !containerRef.value) return clearFocus()

    const container = containerRef.value

    // Don't focus verse 1 or if the content doesn't need to be scrolled
    if (verseNumber.value === 1 || container.scrollHeight <= container.clientHeight) {
      return clearFocus()
    }

    focusVerseByNumber(verseNumber.value)
  }

  const handleVerseFocus = () => {
    verseNumber.value ? focusVerse() : clearFocus()
  }

  const handleScroll = () => {
    if (isScrollingToVerse || scrollTimeout) return resetScrollTimeout()

    if (focusedVerseNumber.value) clearFocus()
  }

  watch(verseNumber, handleVerseFocus)

  return {
    focusedVerseNumber,
    overlayHeight,
    handleScroll,
    handleVerseFocus,
    focusVerseByNumber,
    clearFocus
  }
}
