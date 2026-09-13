import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref, type Ref } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import {
  HIDE_ON_SCROLL_A11Y_SELECTOR,
  READER_CHROME_HIDDEN_CLASS,
  READER_LAYOUT_EXPANDED_CLASS,
  resetHideOnScrollState,
  useHideOnScroll,
} from '~/composables/bible/useHideOnScroll'
import { HIDE_ON_SCROLL_DOWN_DELTA, HIDE_ON_SCROLL_TOP_THRESHOLD } from '~/utils/bible/hideOnScroll'
import { useFullscreen } from '~/composables/bible/useBibleFullscreen'

type MountedState = {
  areHeadersVisible: Ref<boolean>
  reset: () => void
  container: HTMLElement
}

function createScrollContainer() {
  const container = document.createElement('div')
  Object.defineProperty(container, 'scrollHeight', { value: 2000, configurable: true })
  Object.defineProperty(container, 'clientHeight', { value: 400, configurable: true })
  container.scrollTop = 0
  document.body.appendChild(container)
  return container
}

function dispatchScroll(container: HTMLElement, scrollTop: number) {
  container.scrollTop = scrollTop
  container.dispatchEvent(new Event('scroll'))
}

async function mountHideOnScroll(container = createScrollContainer()) {
  const state = {} as MountedState
  let wrapper: Awaited<ReturnType<typeof mountSuspended>> | undefined

  const TestComponent = defineComponent({
    setup() {
      const containerRef = ref(container)
      const { areHeadersVisible, reset } = useHideOnScroll(containerRef)

      state.areHeadersVisible = areHeadersVisible
      state.reset = reset
      state.container = container

      return () => h('div')
    },
  })

  wrapper = await mountSuspended(TestComponent)
  await nextTick()

  return {
    ...state,
    unmount: () => {
      wrapper?.unmount()
      container.remove()
    },
  }
}

describe('useHideOnScroll', () => {
  afterEach(() => {
    resetHideOnScrollState()
    useFullscreen().disable()
    document.documentElement.classList.remove(READER_CHROME_HIDDEN_CLASS)
    document.documentElement.classList.remove(READER_LAYOUT_EXPANDED_CLASS)
    document.getElementById('drawer')?.remove()
    document.querySelectorAll('.p-popover').forEach(node => node.remove())
    document.querySelectorAll(HIDE_ON_SCROLL_A11Y_SELECTOR).forEach(node => node.remove())
  })

  function mountChromeElements() {
    const appHeader = document.createElement('div')
    appHeader.className = 'hide-on-scroll-app-header'
    const chapterHeader = document.createElement('div')
    chapterHeader.className = 'hide-on-scroll-chapter-header'
    document.body.append(appHeader, chapterHeader)
    return { appHeader, chapterHeader }
  }

  it('hides headers when the chapter container scrolls down past the tolerance', async () => {
    const mounted = await mountHideOnScroll()

    dispatchScroll(
      mounted.container,
      HIDE_ON_SCROLL_TOP_THRESHOLD + 1 + HIDE_ON_SCROLL_DOWN_DELTA,
    )

    expect(mounted.areHeadersVisible.value).toBe(false)
    expect(document.documentElement.classList.contains(READER_CHROME_HIDDEN_CLASS)).toBe(true)
    expect(document.documentElement.classList.contains(READER_LAYOUT_EXPANDED_CLASS)).toBe(true)

    mounted.unmount()
  })

  it('marks slid-away headers as aria-hidden and inert', async () => {
    const { appHeader, chapterHeader } = mountChromeElements()
    const mounted = await mountHideOnScroll()

    dispatchScroll(
      mounted.container,
      HIDE_ON_SCROLL_TOP_THRESHOLD + 1 + HIDE_ON_SCROLL_DOWN_DELTA,
    )

    expect(appHeader.getAttribute('aria-hidden')).toBe('true')
    expect(chapterHeader.getAttribute('aria-hidden')).toBe('true')
    expect(appHeader.inert).toBe(true)
    expect(chapterHeader.inert).toBe(true)

    dispatchScroll(mounted.container, 0)

    expect(appHeader.hasAttribute('aria-hidden')).toBe(false)
    expect(chapterHeader.hasAttribute('aria-hidden')).toBe(false)
    expect(appHeader.inert).toBe(false)
    expect(chapterHeader.inert).toBe(false)

    mounted.unmount()
  })

  it('shows headers when scrolling back to the top', async () => {
    const mounted = await mountHideOnScroll()

    dispatchScroll(
      mounted.container,
      HIDE_ON_SCROLL_TOP_THRESHOLD + 1 + HIDE_ON_SCROLL_DOWN_DELTA,
    )
    expect(mounted.areHeadersVisible.value).toBe(false)

    dispatchScroll(mounted.container, 0)

    expect(mounted.areHeadersVisible.value).toBe(true)
    expect(document.documentElement.classList.contains(READER_CHROME_HIDDEN_CLASS)).toBe(false)

    mounted.unmount()
  })

  it('reset forces headers visible without unbinding', async () => {
    const mounted = await mountHideOnScroll()

    dispatchScroll(
      mounted.container,
      HIDE_ON_SCROLL_TOP_THRESHOLD + 1 + HIDE_ON_SCROLL_DOWN_DELTA,
    )
    expect(mounted.areHeadersVisible.value).toBe(false)

    mounted.reset()

    expect(mounted.areHeadersVisible.value).toBe(true)

    dispatchScroll(
      mounted.container,
      HIDE_ON_SCROLL_TOP_THRESHOLD + 1 + HIDE_ON_SCROLL_DOWN_DELTA + 40,
    )
    expect(mounted.areHeadersVisible.value).toBe(false)

    mounted.unmount()
  })

  it('restores visibility when the reader unmounts', async () => {
    const mounted = await mountHideOnScroll()

    dispatchScroll(
      mounted.container,
      HIDE_ON_SCROLL_TOP_THRESHOLD + 1 + HIDE_ON_SCROLL_DOWN_DELTA,
    )
    expect(mounted.areHeadersVisible.value).toBe(false)

    mounted.unmount()
    await nextTick()

    expect(document.documentElement.classList.contains(READER_CHROME_HIDDEN_CLASS)).toBe(false)
  })

  it('does not hide while the mobile drawer is open', async () => {
    const drawer = document.createElement('input')
    drawer.type = 'checkbox'
    drawer.id = 'drawer'
    drawer.checked = true
    document.body.appendChild(drawer)

    const mounted = await mountHideOnScroll()

    dispatchScroll(
      mounted.container,
      HIDE_ON_SCROLL_TOP_THRESHOLD + 1 + HIDE_ON_SCROLL_DOWN_DELTA,
    )

    expect(mounted.areHeadersVisible.value).toBe(true)

    mounted.unmount()
  })

  it('keeps headers visible after closing the drawer without a new scroll', async () => {
    const drawer = document.createElement('input')
    drawer.type = 'checkbox'
    drawer.id = 'drawer'
    drawer.checked = true
    document.body.appendChild(drawer)

    const mounted = await mountHideOnScroll()

    dispatchScroll(
      mounted.container,
      HIDE_ON_SCROLL_TOP_THRESHOLD + 1 + HIDE_ON_SCROLL_DOWN_DELTA,
    )
    expect(mounted.areHeadersVisible.value).toBe(true)

    // Current behavior: closing the drawer does not re-evaluate scroll position.
    drawer.checked = false
    drawer.dispatchEvent(new Event('change'))

    expect(mounted.areHeadersVisible.value).toBe(true)
    expect(document.documentElement.classList.contains(READER_CHROME_HIDDEN_CLASS)).toBe(false)

    mounted.unmount()
  })

  it('does not hide while a visible popover is open', async () => {
    const popover = document.createElement('div')
    popover.className = 'p-popover'
    Object.defineProperty(popover, 'offsetWidth', { value: 120 })
    Object.defineProperty(popover, 'offsetHeight', { value: 80 })
    document.body.appendChild(popover)

    const mounted = await mountHideOnScroll()

    dispatchScroll(
      mounted.container,
      HIDE_ON_SCROLL_TOP_THRESHOLD + 1 + HIDE_ON_SCROLL_DOWN_DELTA,
    )

    expect(mounted.areHeadersVisible.value).toBe(true)

    mounted.unmount()
  })

  it('keeps headers visible after removing a popover without a new scroll', async () => {
    const popover = document.createElement('div')
    popover.className = 'p-popover'
    Object.defineProperty(popover, 'offsetWidth', { value: 120 })
    Object.defineProperty(popover, 'offsetHeight', { value: 80 })
    document.body.appendChild(popover)

    const mounted = await mountHideOnScroll()

    dispatchScroll(
      mounted.container,
      HIDE_ON_SCROLL_TOP_THRESHOLD + 1 + HIDE_ON_SCROLL_DOWN_DELTA,
    )
    expect(mounted.areHeadersVisible.value).toBe(true)

    // Current behavior: overlay checks only run on scroll, so closing alone
    // does not hide chrome until the next scroll event.
    popover.remove()

    expect(mounted.areHeadersVisible.value).toBe(true)
    expect(document.documentElement.classList.contains(READER_CHROME_HIDDEN_CLASS)).toBe(false)

    mounted.unmount()
  })

  it('keeps headers visible while fullscreen even if the container scrolls', async () => {
    const mounted = await mountHideOnScroll()
    useFullscreen().enable()

    dispatchScroll(
      mounted.container,
      HIDE_ON_SCROLL_TOP_THRESHOLD + 1 + HIDE_ON_SCROLL_DOWN_DELTA,
    )

    expect(mounted.areHeadersVisible.value).toBe(true)

    mounted.unmount()
  })

  it('shows chrome when the chapter container reaches the bottom', async () => {
    const mounted = await mountHideOnScroll()

    dispatchScroll(
      mounted.container,
      HIDE_ON_SCROLL_TOP_THRESHOLD + 1 + HIDE_ON_SCROLL_DOWN_DELTA,
    )
    expect(mounted.areHeadersVisible.value).toBe(false)
    expect(document.documentElement.classList.contains(READER_LAYOUT_EXPANDED_CLASS)).toBe(true)

    // scrollHeight 2000, clientHeight 400 → maxScroll 1600
    dispatchScroll(mounted.container, 1600)

    expect(mounted.areHeadersVisible.value).toBe(true)
    expect(document.documentElement.classList.contains(READER_CHROME_HIDDEN_CLASS)).toBe(false)
    // Restore header offset at the bottom so the scroller only covers chapter text.
    expect(document.documentElement.classList.contains(READER_LAYOUT_EXPANDED_CLASS)).toBe(false)

    mounted.unmount()
  })

  it('restores layout when chrome reappears while scrolling up', async () => {
    const mounted = await mountHideOnScroll()

    dispatchScroll(mounted.container, 200)
    expect(mounted.areHeadersVisible.value).toBe(false)
    expect(document.documentElement.classList.contains(READER_LAYOUT_EXPANDED_CLASS)).toBe(true)

    // Significant upward scroll (not at bottom) should show chrome and restore offset
    dispatchScroll(mounted.container, 160)

    expect(mounted.areHeadersVisible.value).toBe(true)
    expect(document.documentElement.classList.contains(READER_LAYOUT_EXPANDED_CLASS)).toBe(false)

    mounted.unmount()
  })

  it('does not show chrome when only near the bottom', async () => {
    const mounted = await mountHideOnScroll()

    dispatchScroll(
      mounted.container,
      HIDE_ON_SCROLL_TOP_THRESHOLD + 1 + HIDE_ON_SCROLL_DOWN_DELTA,
    )
    expect(mounted.areHeadersVisible.value).toBe(false)

    // maxScroll 1600 — 48px away is "near" but not at the end
    dispatchScroll(mounted.container, 1552)

    expect(mounted.areHeadersVisible.value).toBe(false)

    mounted.unmount()
  })
})
