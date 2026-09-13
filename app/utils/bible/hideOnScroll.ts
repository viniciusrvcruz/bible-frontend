/** Always show chrome when the scroll position is at or below this value (px). */
export const HIDE_ON_SCROLL_TOP_THRESHOLD = 16

/**
 * Show chrome only when effectively at the bottom (px). Keep tiny for sub-pixel /
 * rounding noise — not a "near bottom" preview zone.
 */
export const HIDE_ON_SCROLL_BOTTOM_THRESHOLD = 2

/**
 * While pinned at the bottom, ignore downward movement. Release only after the
 * user scrolls this far up from the bottom (px).
 */
export const HIDE_ON_SCROLL_BOTTOM_RELEASE = 80

/** Minimum downward movement before hiding (px). Ignores 1–2px noise. */
export const HIDE_ON_SCROLL_DOWN_DELTA = 12

/** Minimum upward movement before showing (px). Larger than down to resist bounce. */
export const HIDE_ON_SCROLL_UP_DELTA = 24

export type HideOnScrollSnapshot = {
  scrollTop: number
  scrollHeight: number
  clientHeight: number
  lastScrollTop: number
  isVisible: boolean
  forceVisible: boolean
  /** Latched after reaching the bottom; cleared only after scrolling far enough up. */
  pinnedAtBottom: boolean
}

export type HideOnScrollResult = {
  isVisible: boolean
  lastScrollTop: number
  changed: boolean
  pinnedAtBottom: boolean
}

/**
 * Pure hide-on-scroll decision. Does not read the window — callers pass the
 * scrolling container's metrics (e.g. the chapter overflow element).
 */
export function computeHideOnScroll(snapshot: HideOnScrollSnapshot): HideOnScrollResult {
  const {
    scrollTop,
    scrollHeight,
    clientHeight,
    lastScrollTop,
    isVisible,
    forceVisible,
    pinnedAtBottom,
  } = snapshot

  const maxScroll = Math.max(0, scrollHeight - clientHeight)

  // Rubber-band above the top: ignore without moving the baseline.
  if (scrollTop < 0) {
    return { isVisible, lastScrollTop, changed: false, pinnedAtBottom }
  }

  // Overscroll past the bottom: treat as "at end" and keep chrome visible.
  if (maxScroll > 0 && scrollTop > maxScroll) {
    return {
      isVisible: true,
      lastScrollTop: maxScroll,
      changed: !isVisible,
      pinnedAtBottom: true,
    }
  }

  const clamped = Math.min(Math.max(scrollTop, 0), maxScroll)
  const distanceFromBottom = maxScroll - clamped
  const atBottom = maxScroll > 0 && distanceFromBottom <= HIDE_ON_SCROLL_BOTTOM_THRESHOLD

  if (forceVisible || clamped <= HIDE_ON_SCROLL_TOP_THRESHOLD) {
    return {
      isVisible: true,
      lastScrollTop: clamped,
      changed: !isVisible,
      pinnedAtBottom: false,
    }
  }

  if (atBottom) {
    return {
      isVisible: true,
      lastScrollTop: clamped,
      changed: !isVisible,
      pinnedAtBottom: true,
    }
  }

  // Stay visible at the end until the user clearly scrolls up — never hide on
  // residual down movement in the post-layout gap.
  if (pinnedAtBottom) {
    if (distanceFromBottom <= HIDE_ON_SCROLL_BOTTOM_RELEASE) {
      return {
        isVisible: true,
        lastScrollTop: clamped,
        changed: false,
        pinnedAtBottom: true,
      }
    }

    return {
      isVisible,
      lastScrollTop: clamped,
      changed: false,
      pinnedAtBottom: false,
    }
  }

  const delta = clamped - lastScrollTop

  if (delta >= HIDE_ON_SCROLL_DOWN_DELTA) {
    return {
      isVisible: false,
      lastScrollTop: clamped,
      changed: isVisible,
      pinnedAtBottom: false,
    }
  }

  if (delta <= -HIDE_ON_SCROLL_UP_DELTA) {
    return {
      isVisible: true,
      lastScrollTop: clamped,
      changed: !isVisible,
      pinnedAtBottom: false,
    }
  }

  const continuingInCurrentDirection =
    (delta > 0 && !isVisible) || (delta < 0 && isVisible)

  return {
    isVisible,
    lastScrollTop: continuingInCurrentDirection ? clamped : lastScrollTop,
    changed: false,
    pinnedAtBottom: false,
  }
}
