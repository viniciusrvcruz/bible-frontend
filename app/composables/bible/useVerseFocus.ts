export const useVerseFocus = (
  containerRef: Ref<HTMLElement | null>,
  verseNumber: Ref<number | null> | ComputedRef<number | null>,
  onClearFocus?: () => void
) => {
  const focusedVerseId = ref<string | null>(null)
  const scrollTimeoutId = ref<ReturnType<typeof setTimeout> | null>(null)

  const isFocusActive = computed(() => !!focusedVerseId.value)

  const overlayHeight = computed(() => {
    if (!isFocusActive.value || !containerRef.value) return 0

    return containerRef.value.scrollHeight
  })

  const shouldFocusVerse = (verseNum: number): boolean => {
    if (verseNum === 1) return false

    const container = containerRef.value
    if (!container) return false

    return container.scrollHeight > container.clientHeight
  }

  const resetScrollFlag = () => {
    if (scrollTimeoutId.value) clearTimeout(scrollTimeoutId.value)

    scrollTimeoutId.value = setTimeout(() => {
      scrollTimeoutId.value = null
    }, 150)
  }

  const focusVerse = (verseNum: number) => {
    const verseId = `v${verseNum}`
    const verseElement = containerRef.value?.querySelector(`#${verseId}`)

    if (!verseElement) return

    focusedVerseId.value = verseId
    verseElement.scrollIntoView({ behavior: 'smooth' })
    resetScrollFlag()
  }

  const clearFocus = () => {
    focusedVerseId.value = null

    if (verseNumber.value) {
      onClearFocus?.()
    }
  }

  const handleVerseFocus = (verseNum: number | null) => {
    if (!verseNum) return clearFocus()

    if (!shouldFocusVerse(verseNum)) return clearFocus()

    focusVerse(verseNum)
  }

  const handleScroll = () => {
    if (scrollTimeoutId.value !== null) return resetScrollFlag()

    if (!isFocusActive.value) return

    clearFocus()
  }

  watch(verseNumber, handleVerseFocus)

  return {
    focusedVerseId,
    isFocusActive,
    overlayHeight,
    handleScroll,
    handleVerseFocus,
    clearFocus
  }
}

