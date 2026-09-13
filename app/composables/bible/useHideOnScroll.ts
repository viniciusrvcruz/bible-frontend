import type { MaybeRefOrGetter } from 'vue'
import { computeHideOnScroll } from '~/utils/bible/hideOnScroll'
import { useFullscreen } from '~/composables/bible/useBibleFullscreen'

/** Visual hide (transform). Independent from layout expansion to avoid bottom flicker. */
export const READER_CHROME_HIDDEN_CLASS = 'reader-chrome-hidden'

/**
 * Collapse the 4rem app-header gap while chrome is tucked away.
 * Toggled in lockstep with reader-chrome-hidden (expanded ⇔ chrome hidden).
 */
export const READER_LAYOUT_EXPANDED_CLASS = 'reader-layout-expanded'

/** Headers that slide away with hide-on-scroll and must leave the a11y tree when hidden. */
export const HIDE_ON_SCROLL_A11Y_SELECTOR =
  '.hide-on-scroll-app-header, .hide-on-scroll-chapter-header'

const areHeadersVisible = ref(true)
const isLayoutExpanded = ref(false)

let boundElement: HTMLElement | null = null
let lastScrollTop = 0
let pinnedAtBottom = false
let ignoreScrollEvents = false
let ignoreScrollTimeout: ReturnType<typeof setTimeout> | null = null
let resizeObserver: ResizeObserver | null = null
let drawerToggle: HTMLInputElement | null = null

const { isFullscreen } = useFullscreen()

function syncChromeA11y(hidden: boolean) {
  if (!import.meta.client) return

  document.querySelectorAll(HIDE_ON_SCROLL_A11Y_SELECTOR).forEach((node) => {
    if (!(node instanceof HTMLElement)) return

    if (hidden) {
      node.setAttribute('aria-hidden', 'true')
      node.inert = true
    }
    else {
      node.removeAttribute('aria-hidden')
      node.inert = false
    }
  })
}

function syncDomClasses() {
  if (!import.meta.client) return

  const chromeHidden = !areHeadersVisible.value

  document.documentElement.classList.toggle(READER_CHROME_HIDDEN_CLASS, chromeHidden)
  document.documentElement.classList.toggle(READER_LAYOUT_EXPANDED_CLASS, isLayoutExpanded.value)
  syncChromeA11y(chromeHidden)
}

/**
 * Chrome hidden → expand reader (gain the 4rem).
 * Chrome visible → restore header offset immediately (scroll = text only).
 * At the bottom we then re-pin scrollTop to the new maxScroll to avoid flicker.
 */
function setHeadersVisible(visible: boolean) {
  isLayoutExpanded.value = !visible

  if (areHeadersVisible.value === visible) {
    syncDomClasses()
    return
  }

  areHeadersVisible.value = visible
  syncDomClasses()
}

function clearIgnoreScrollTimeout() {
  if (ignoreScrollTimeout) {
    clearTimeout(ignoreScrollTimeout)
    ignoreScrollTimeout = null
  }
}

function stopResizePin() {
  resizeObserver?.disconnect()
  resizeObserver = null
}

function snapToBottom(el: HTMLElement) {
  const maxScroll = Math.max(0, el.scrollHeight - el.clientHeight)
  if (el.scrollTop < maxScroll) {
    el.scrollTop = maxScroll
  }
  lastScrollTop = el.scrollTop
}

/**
 * After chrome / compact-footer layout changes, keep the user glued to the
 * bottom until sizes settle (transforms, grid rows, header offset).
 */
function pinScrollToBottomAfterLayout() {
  if (!boundElement || !pinnedAtBottom) return

  const el = boundElement
  ignoreScrollEvents = true
  clearIgnoreScrollTimeout()
  stopResizePin()

  const previousBehavior = el.style.scrollBehavior
  el.style.scrollBehavior = 'auto'

  snapToBottom(el)

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      if (!pinnedAtBottom || boundElement !== el) return
      snapToBottom(el)
    })
    resizeObserver.observe(el)
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (!boundElement || boundElement !== el) {
        el.style.scrollBehavior = previousBehavior
        stopResizePin()
        ignoreScrollEvents = false
        return
      }

      snapToBottom(el)
      el.style.scrollBehavior = previousBehavior

      ignoreScrollTimeout = setTimeout(() => {
        stopResizePin()
        ignoreScrollEvents = false
        ignoreScrollTimeout = null
      }, 350)
    })
  })
}

function isDrawerOpen() {
  if (!import.meta.client) return false

  const drawer = document.getElementById('drawer')
  return drawer instanceof HTMLInputElement && drawer.checked
}

function hasVisibleOverlay() {
  if (!import.meta.client) return false

  try {
    if (document.querySelector(':popover-open')) return true
  }
  catch {
    // :popover-open is not supported in every test environment
  }

  const popovers = document.querySelectorAll<HTMLElement>('.p-popover')
  for (const popover of popovers) {
    if (popover.offsetWidth > 0 && popover.offsetHeight > 0) return true
  }

  return false
}

function isHideOnScrollBlocked() {
  return isFullscreen.value || isDrawerOpen() || hasVisibleOverlay()
}

function onDrawerChange() {
  if (isDrawerOpen()) setHeadersVisible(true)
}

function bindDrawerToggle() {
  if (!import.meta.client || drawerToggle) return

  const drawer = document.getElementById('drawer')
  if (!(drawer instanceof HTMLInputElement)) return

  drawerToggle = drawer
  drawerToggle.addEventListener('change', onDrawerChange)
}

function unbindDrawerToggle() {
  drawerToggle?.removeEventListener('change', onDrawerChange)
  drawerToggle = null
}

function onContainerScroll() {
  if (!boundElement || ignoreScrollEvents) return

  const next = computeHideOnScroll({
    scrollTop: boundElement.scrollTop,
    scrollHeight: boundElement.scrollHeight,
    clientHeight: boundElement.clientHeight,
    lastScrollTop,
    isVisible: areHeadersVisible.value,
    forceVisible: isHideOnScrollBlocked(),
    pinnedAtBottom,
  })

  lastScrollTop = next.lastScrollTop
  const wasPinned = pinnedAtBottom
  pinnedAtBottom = next.pinnedAtBottom

  if (next.changed) {
    setHeadersVisible(next.isVisible)
    if (next.isVisible && next.pinnedAtBottom) {
      pinScrollToBottomAfterLayout()
    }
  }
  else if (next.pinnedAtBottom && !wasPinned) {
    pinScrollToBottomAfterLayout()
  }
}

function bindScrollContainer(element: HTMLElement | null) {
  if (!import.meta.client) return

  if (boundElement === element) return

  if (boundElement) {
    boundElement.removeEventListener('scroll', onContainerScroll)
  }

  boundElement = element
  lastScrollTop = element?.scrollTop ?? 0
  pinnedAtBottom = false
  ignoreScrollEvents = false
  clearIgnoreScrollTimeout()
  stopResizePin()

  if (!element) return

  element.addEventListener('scroll', onContainerScroll, { passive: true })
  bindDrawerToggle()
  onContainerScroll()
}

function unbindScrollContainer() {
  boundElement?.removeEventListener('scroll', onContainerScroll)
  boundElement = null
  lastScrollTop = 0
  pinnedAtBottom = false
  ignoreScrollEvents = false
  clearIgnoreScrollTimeout()
  stopResizePin()
  unbindDrawerToggle()
  areHeadersVisible.value = true
  isLayoutExpanded.value = false

  if (import.meta.client) {
    document.documentElement.classList.remove(READER_CHROME_HIDDEN_CLASS)
    document.documentElement.classList.remove(READER_LAYOUT_EXPANDED_CLASS)
    syncChromeA11y(false)
  }
}

function resetHideOnScroll() {
  lastScrollTop = 0
  pinnedAtBottom = false
  areHeadersVisible.value = true
  isLayoutExpanded.value = false
  syncDomClasses()
}

/**
 * Shared reader chrome visibility. Bind the chapter overflow container from
 * BibleChapter; LayoutHeader / ChapterHeader follow the html classes toggled here.
 */
export const useHideOnScroll = (
  containerRef?: MaybeRefOrGetter<HTMLElement | null>,
) => {
  if (containerRef) {
    watch(
      () => toValue(containerRef),
      (element) => {
        bindScrollContainer(element)
      },
      { immediate: true, flush: 'post' },
    )

    watch(isFullscreen, (fullscreen) => {
      if (fullscreen) setHeadersVisible(true)
    })

    onBeforeUnmount(() => {
      unbindScrollContainer()
    })
  }

  return {
    areHeadersVisible: readonly(areHeadersVisible),
    reset: resetHideOnScroll,
  }
}

/** Test helper: drop listeners and restore the default visible state. */
export function resetHideOnScrollState() {
  unbindScrollContainer()
}
