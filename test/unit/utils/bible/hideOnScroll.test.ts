import { describe, expect, it } from 'vitest'
import {
  computeHideOnScroll,
  HIDE_ON_SCROLL_BOTTOM_RELEASE,
  HIDE_ON_SCROLL_BOTTOM_THRESHOLD,
  HIDE_ON_SCROLL_DOWN_DELTA,
  HIDE_ON_SCROLL_TOP_THRESHOLD,
  HIDE_ON_SCROLL_UP_DELTA,
} from '~/utils/bible/hideOnScroll'

const tallContainer = {
  scrollHeight: 2000,
  clientHeight: 400,
}

const maxScroll = tallContainer.scrollHeight - tallContainer.clientHeight

function snapshot(
  overrides: Partial<Parameters<typeof computeHideOnScroll>[0]> = {},
) {
  return computeHideOnScroll({
    scrollTop: 0,
    lastScrollTop: 0,
    isVisible: true,
    forceVisible: false,
    pinnedAtBottom: false,
    ...tallContainer,
    ...overrides,
  })
}

describe('computeHideOnScroll', () => {
  it('keeps headers visible at the top of the container', () => {
    const result = snapshot({ scrollTop: HIDE_ON_SCROLL_TOP_THRESHOLD })

    expect(result.isVisible).toBe(true)
    expect(result.changed).toBe(false)
    expect(result.pinnedAtBottom).toBe(false)
    expect(result.lastScrollTop).toBe(HIDE_ON_SCROLL_TOP_THRESHOLD)
  })

  it('shows headers when returning to the top while hidden', () => {
    const result = snapshot({
      scrollTop: 0,
      lastScrollTop: 240,
      isVisible: false,
    })

    expect(result.isVisible).toBe(true)
    expect(result.changed).toBe(true)
  })

  it('does not hide for movement below the down tolerance', () => {
    const start = HIDE_ON_SCROLL_TOP_THRESHOLD + 1
    const result = snapshot({
      scrollTop: start + HIDE_ON_SCROLL_DOWN_DELTA - 1,
      lastScrollTop: start,
    })

    expect(result.isVisible).toBe(true)
    expect(result.changed).toBe(false)
    expect(result.lastScrollTop).toBe(start)
  })

  it('hides after a downward movement that meets the tolerance', () => {
    const start = HIDE_ON_SCROLL_TOP_THRESHOLD + 1
    const result = snapshot({
      scrollTop: start + HIDE_ON_SCROLL_DOWN_DELTA,
      lastScrollTop: start,
    })

    expect(result.isVisible).toBe(false)
    expect(result.changed).toBe(true)
    expect(result.lastScrollTop).toBe(start + HIDE_ON_SCROLL_DOWN_DELTA)
  })

  it('does not show for an upward movement below the up tolerance', () => {
    const result = snapshot({
      scrollTop: 200,
      lastScrollTop: 200 + HIDE_ON_SCROLL_UP_DELTA - 1,
      isVisible: false,
    })

    expect(result.isVisible).toBe(false)
    expect(result.changed).toBe(false)
    expect(result.lastScrollTop).toBe(200 + HIDE_ON_SCROLL_UP_DELTA - 1)
  })

  it('shows after a significant upward movement', () => {
    const result = snapshot({
      scrollTop: 200,
      lastScrollTop: 200 + HIDE_ON_SCROLL_UP_DELTA,
      isVisible: false,
    })

    expect(result.isVisible).toBe(true)
    expect(result.changed).toBe(true)
  })

  it('ignores overscroll below 0 without changing state', () => {
    const result = snapshot({
      scrollTop: -40,
      lastScrollTop: 80,
      isVisible: false,
    })

    expect(result.isVisible).toBe(false)
    expect(result.changed).toBe(false)
    expect(result.lastScrollTop).toBe(80)
  })

  it('shows chrome when overscrolling past the bottom', () => {
    const result = snapshot({
      scrollTop: 2000,
      lastScrollTop: 1600,
      isVisible: false,
    })

    expect(result.isVisible).toBe(true)
    expect(result.changed).toBe(true)
    expect(result.pinnedAtBottom).toBe(true)
    expect(result.lastScrollTop).toBe(maxScroll)
  })

  it('does not show chrome merely near the bottom', () => {
    const result = snapshot({
      scrollTop: maxScroll - 48,
      lastScrollTop: maxScroll - 80,
      isVisible: false,
    })

    expect(result.isVisible).toBe(false)
    expect(result.pinnedAtBottom).toBe(false)
  })

  it('shows chrome only when effectively at the bottom', () => {
    const result = snapshot({
      scrollTop: maxScroll - HIDE_ON_SCROLL_BOTTOM_THRESHOLD,
      lastScrollTop: maxScroll - 80,
      isVisible: false,
    })

    expect(result.isVisible).toBe(true)
    expect(result.changed).toBe(true)
    expect(result.pinnedAtBottom).toBe(true)
  })

  it('stays pinned while the user fills a post-reveal gap downward', () => {
    const scrollTop = maxScroll - 64

    const result = snapshot({
      scrollTop: scrollTop + HIDE_ON_SCROLL_DOWN_DELTA,
      lastScrollTop: scrollTop,
      isVisible: true,
      pinnedAtBottom: true,
    })

    expect(result.isVisible).toBe(true)
    expect(result.pinnedAtBottom).toBe(true)
  })

  it('releases the bottom pin after scrolling far enough away', () => {
    const scrollTop = maxScroll - HIDE_ON_SCROLL_BOTTOM_RELEASE - 1

    const result = snapshot({
      scrollTop,
      lastScrollTop: maxScroll,
      isVisible: true,
      pinnedAtBottom: true,
    })

    expect(result.pinnedAtBottom).toBe(false)
  })

  it('treats sub-pixel distances within the bottom threshold as at the end', () => {
    for (const distance of [0, 0.4, 1.2, 2.0]) {
      const result = snapshot({
        scrollTop: maxScroll - distance,
        lastScrollTop: maxScroll - 80,
        isVisible: false,
      })

      expect(result.isVisible, `distance ${distance}`).toBe(true)
      expect(result.pinnedAtBottom, `distance ${distance}`).toBe(true)
    }
  })

  it('does not flicker visibility for sub-pixel positions just outside the bottom threshold', () => {
    const result = snapshot({
      scrollTop: maxScroll - 2.4,
      lastScrollTop: maxScroll - 80,
      isVisible: false,
    })

    expect(result.isVisible).toBe(false)
    expect(result.pinnedAtBottom).toBe(false)
  })

  it('keeps a bottom pin stable across sub-pixel jitter near the end', () => {
    for (const distance of [1.2, 2.0, 2.4, 10, 40]) {
      const result = snapshot({
        scrollTop: maxScroll - distance,
        lastScrollTop: maxScroll,
        isVisible: true,
        pinnedAtBottom: true,
      })

      expect(result.isVisible, `distance ${distance}`).toBe(true)
      expect(result.pinnedAtBottom, `distance ${distance}`).toBe(true)
    }
  })

  it('keeps headers visible when forceVisible is set', () => {
    const start = HIDE_ON_SCROLL_TOP_THRESHOLD + 1
    const result = snapshot({
      scrollTop: start + 80,
      lastScrollTop: start,
      forceVisible: true,
    })

    expect(result.isVisible).toBe(true)
    expect(result.changed).toBe(false)
  })

  it('tracks the position when continuing in the current hidden direction', () => {
    const result = snapshot({
      scrollTop: 210,
      lastScrollTop: 200,
      isVisible: false,
    })

    expect(result.isVisible).toBe(false)
    expect(result.lastScrollTop).toBe(210)
  })
})
