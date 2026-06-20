import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { mockComponent, mountSuspended } from '@nuxt/test-utils/runtime'
import BibleChapterVerseReference from '~/components/bible/chapter/VerseReference.vue'
import { provideVerseFocusContext } from '~/composables/bible/useVerseFocusContext'
import type { VerseReference } from '~/types/verseReference/VerseReference.type'

const reference: VerseReference = {
  id: 1,
  slug: 'ref-1',
  text: 'Texto da referência bíblica.',
}

const triggerSelector = 'button[aria-label^="Ver referência bíblica"]'
const closeSelector = 'button[aria-label="Fechar"]'

mockComponent('Icon', {
  props: ['icon'],
  template: '<span />',
})

mockComponent('Popover', {
  emits: ['show', 'hide'],
  setup(_props, { slots, emit, expose }) {
    expose({
      toggle: () => emit('show'),
      hide: () => emit('hide'),
    })

    return () => h('div', { class: 'popover-stub' }, slots.default?.())
  },
})

async function mountVerseReference(verseNumber?: number) {
  const focusVerseByNumber = vi.fn()
  const clearFocus = vi.fn()

  const Wrapper = defineComponent({
    components: { BibleChapterVerseReference },
    setup() {
      provideVerseFocusContext({ focusVerseByNumber, clearFocus })
    },
    render() {
      return h(BibleChapterVerseReference, {
        reference,
        verseNumber,
      })
    },
  })

  const wrapper = await mountSuspended(Wrapper)

  return { wrapper, focusVerseByNumber, clearFocus }
}

describe('BibleChapterVerseReference', () => {
  it('focuses the verse without scrolling when the popover opens', async () => {
    const { wrapper, focusVerseByNumber } = await mountVerseReference(8)

    await wrapper.find(triggerSelector).trigger('click')

    expect(focusVerseByNumber).toHaveBeenCalledWith(8, false)
  })

  it('clears focus when the popover closes', async () => {
    const { wrapper, clearFocus } = await mountVerseReference(8)

    await wrapper.find(triggerSelector).trigger('click')
    await wrapper.find(closeSelector).trigger('click')

    expect(clearFocus).toHaveBeenCalledOnce()
  })

  it('does not focus a verse when verseNumber is omitted', async () => {
    const { wrapper, focusVerseByNumber, clearFocus } = await mountVerseReference()

    await wrapper.find(triggerSelector).trigger('click')
    await wrapper.find(closeSelector).trigger('click')

    expect(focusVerseByNumber).not.toHaveBeenCalled()
    expect(clearFocus).not.toHaveBeenCalled()
  })

  it('marks the trigger button as expanded while the popover is open', async () => {
    const { wrapper } = await mountVerseReference(8)
    const button = wrapper.find(triggerSelector)

    expect(button.attributes('aria-expanded')).toBe('false')

    await button.trigger('click')

    expect(button.attributes('aria-expanded')).toBe('true')
    expect(button.classes()).toContain('ring-2')

    await wrapper.find(closeSelector).trigger('click')

    expect(button.attributes('aria-expanded')).toBe('false')
    expect(button.classes()).not.toContain('ring-2')
  })
})
