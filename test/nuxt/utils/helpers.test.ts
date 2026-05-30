import { describe, expect, it } from 'vitest'
import { isInputFocused } from '~/utils/helpers'

describe('isInputFocused', () => {
  it('returns false when nothing is focused', () => {
    expect(isInputFocused()).toBe(false)
  })

  it('returns true when an input is focused', () => {
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.focus()

    expect(isInputFocused()).toBe(true)

    document.body.removeChild(input)
  })

  it('returns true when a contenteditable element is focused', () => {
    const editable = document.createElement('div')
    editable.setAttribute('contenteditable', 'true')
    document.body.appendChild(editable)
    editable.focus()

    expect(isInputFocused()).toBe(true)

    document.body.removeChild(editable)
  })
})
