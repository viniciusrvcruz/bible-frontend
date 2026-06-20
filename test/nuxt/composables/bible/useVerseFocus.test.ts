import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, effectScope, h, nextTick, ref, type EffectScope, type Ref } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { useVerseFocus } from '~/composables/bible/useVerseFocus'

type ContainerOptions = {
  scrollHeight?: number
  clientHeight?: number
  verseIds?: number[]
}

type SetupOptions = ContainerOptions & {
  container?: HTMLElement | null
  verseNumber?: number | null
  onClearFocus?: () => void
}

function createContainer(options: ContainerOptions = {}) {
  const {
    scrollHeight = 500,
    clientHeight = 100,
    verseIds = [5],
  } = options

  const container = document.createElement('div')
  Object.defineProperty(container, 'scrollHeight', { value: scrollHeight, configurable: true })
  Object.defineProperty(container, 'clientHeight', { value: clientHeight, configurable: true })

  for (const id of verseIds) {
    const verse = document.createElement('div')
    verse.id = `v${id}`
    verse.scrollIntoView = vi.fn()
    container.appendChild(verse)
  }

  return container
}

function getVerseElement(container: HTMLElement, id: number) {
  return container.querySelector(`#v${id}`) as HTMLElement
}

function setupVerseFocus(options: SetupOptions = {}) {
  const {
    container,
    verseNumber: initialVerseNumber = null,
    onClearFocus,
    scrollHeight,
    clientHeight,
    verseIds,
  } = options

  const resolvedContainer = container === undefined
    ? createContainer({ scrollHeight, clientHeight, verseIds })
    : container

  const scope = effectScope()
  const result = scope.run(() => {
    const containerRef = ref(resolvedContainer)
    const verseNumber = ref<number | null>(initialVerseNumber)
    const composable = useVerseFocus(containerRef, verseNumber, onClearFocus)

    return {
      ...composable,
      container: resolvedContainer,
      containerRef,
      verseNumber,
      getVerseElement: (id: number) =>
        resolvedContainer ? getVerseElement(resolvedContainer, id) : null,
    }
  })!

  return { ...result, scope }
}

describe('useVerseFocus', () => {
  let activeScope: EffectScope | undefined

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    activeScope?.stop()
    activeScope = undefined
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  function useSetup(options: SetupOptions = {}) {
    const setup = setupVerseFocus(options)
    activeScope = setup.scope
    const { scope: _scope, ...result } = setup
    return result
  }

  describe('focusVerseByNumber', () => {
    it('sets focusedVerseNumber when the verse element exists', () => {
      const { focusedVerseNumber, focusVerseByNumber } = useSetup()

      focusVerseByNumber(5, false)

      expect(focusedVerseNumber.value).toBe(5)
    })

    it('does not scroll when shouldScrollIntoVerse is false', () => {
      const { container, focusVerseByNumber } = useSetup()

      focusVerseByNumber(5, false)

      expect(getVerseElement(container!, 5).scrollIntoView).not.toHaveBeenCalled()
    })

    it('scrolls smoothly when shouldScrollIntoVerse is true', () => {
      const { container, focusVerseByNumber } = useSetup()

      focusVerseByNumber(5, true)

      expect(getVerseElement(container!, 5).scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
    })

    it('does nothing when the container is missing', () => {
      const { focusedVerseNumber, focusVerseByNumber } = useSetup({ container: null })

      focusVerseByNumber(5, false)

      expect(focusedVerseNumber.value).toBeNull()
    })

    it('does nothing when the verse element is missing', () => {
      const { focusedVerseNumber, focusVerseByNumber } = useSetup({ verseIds: [1] })

      focusVerseByNumber(99, false)

      expect(focusedVerseNumber.value).toBeNull()
    })
  })

  describe('clearFocus', () => {
    it('clears focusedVerseNumber', () => {
      const { focusedVerseNumber, focusVerseByNumber, clearFocus } = useSetup()

      focusVerseByNumber(5, false)
      clearFocus()

      expect(focusedVerseNumber.value).toBeNull()
    })

    it('calls onClearFocus when route verse number is set', () => {
      const onClearFocus = vi.fn()
      const { focusVerseByNumber, clearFocus } = useSetup({
        verseNumber: 7,
        onClearFocus,
      })

      focusVerseByNumber(5, false)
      clearFocus()

      expect(onClearFocus).toHaveBeenCalledOnce()
    })

    it('does not call onClearFocus when route verse number is missing', () => {
      const onClearFocus = vi.fn()
      const { focusVerseByNumber, clearFocus } = useSetup({ onClearFocus })

      focusVerseByNumber(5, false)
      clearFocus()

      expect(onClearFocus).not.toHaveBeenCalled()
    })
  })

  describe('focusVerse', () => {
    it('skips verse 1 from hash navigation', () => {
      const { focusedVerseNumber, handleVerseFocus } = useSetup({
        verseIds: [1],
        verseNumber: 1,
      })

      handleVerseFocus()

      expect(focusedVerseNumber.value).toBeNull()
    })

    it('skips focus when the chapter does not scroll', () => {
      const { focusedVerseNumber, handleVerseFocus } = useSetup({
        scrollHeight: 100,
        clientHeight: 100,
        verseIds: [5],
        verseNumber: 5,
      })

      handleVerseFocus()

      expect(focusedVerseNumber.value).toBeNull()
    })

    it('focuses and scrolls hash verses when scrolling is needed', () => {
      const { container, focusedVerseNumber, handleVerseFocus } = useSetup({
        verseIds: [5],
        verseNumber: 5,
      })

      handleVerseFocus()

      expect(focusedVerseNumber.value).toBe(5)
      expect(getVerseElement(container!, 5).scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
    })
  })

  describe('watch(verseNumber)', () => {
    async function mountVerseFocusWatcher(options: {
      verseIds?: number[]
      initialVerseNumber?: number | null
    } = {}) {
      const container = createContainer({ verseIds: options.verseIds ?? [5] })
      const state = {} as {
        focusedVerseNumber: Ref<number | null>
        verseNumber: Ref<number | null>
      }

      const TestComponent = defineComponent({
        setup() {
          const containerRef = ref(container)
          const verseNumber = ref<number | null>(options.initialVerseNumber ?? null)
          const { focusedVerseNumber } = useVerseFocus(containerRef, verseNumber)

          state.focusedVerseNumber = focusedVerseNumber
          state.verseNumber = verseNumber

          return () => h('div')
        },
      })

      await mountSuspended(TestComponent)

      return { container, ...state }
    }

    it('focuses when route verse number is set', async () => {
      const { container, focusedVerseNumber, verseNumber } = await mountVerseFocusWatcher()

      verseNumber.value = 5
      await nextTick()

      expect(focusedVerseNumber.value).toBe(5)
      expect(getVerseElement(container, 5).scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
    })

    it('clears focus when route verse number is removed', async () => {
      const { focusedVerseNumber, verseNumber } = await mountVerseFocusWatcher()

      verseNumber.value = 5
      await nextTick()
      expect(focusedVerseNumber.value).toBe(5)

      verseNumber.value = null
      await nextTick()

      expect(focusedVerseNumber.value).toBeNull()
    })
  })

  describe('handleScroll', () => {
    it('clears focus when the user scrolls manually', () => {
      const { focusedVerseNumber, focusVerseByNumber, handleScroll } = useSetup()

      focusVerseByNumber(5, false)
      handleScroll()

      expect(focusedVerseNumber.value).toBeNull()
    })

    it('keeps focus while programmatic scroll is in progress', () => {
      const { focusedVerseNumber, focusVerseByNumber, handleScroll } = useSetup()

      focusVerseByNumber(5, true)
      handleScroll()

      expect(focusedVerseNumber.value).toBe(5)
    })

    it('clears focus after programmatic scroll completes and user scrolls again', () => {
      const { focusedVerseNumber, focusVerseByNumber, handleScroll } = useSetup()

      focusVerseByNumber(5, true)
      handleScroll()

      expect(focusedVerseNumber.value).toBe(5)

      vi.advanceTimersByTime(150)
      handleScroll()

      expect(focusedVerseNumber.value).toBeNull()
    })
  })

  describe('overlayHeight', () => {
    it('returns container scroll height while a verse is focused', () => {
      const { overlayHeight, focusVerseByNumber } = useSetup({ scrollHeight: 640 })

      focusVerseByNumber(5, false)

      expect(overlayHeight.value).toBe(640)
    })

    it('returns zero when no verse is focused', () => {
      const { overlayHeight } = useSetup({ scrollHeight: 640 })

      expect(overlayHeight.value).toBe(0)
    })
  })
})
