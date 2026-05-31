import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { formatDayLabel, formatTime, isSameDay } from '~/utils/date'

describe('isSameDay', () => {
  it('returns true for the same calendar day at different times', () => {
    expect(isSameDay(new Date(2026, 4, 30, 8, 0), new Date(2026, 4, 30, 22, 45))).toBe(true)
  })

  it('returns false for different calendar days', () => {
    expect(isSameDay(new Date(2026, 4, 30), new Date(2026, 4, 29))).toBe(false)
  })
})

describe('formatDayLabel', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 4, 30, 12, 0))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns "Hoje" for timestamps from today', () => {
    expect(formatDayLabel(new Date(2026, 4, 30, 9, 15).getTime())).toBe('Hoje')
  })

  it('returns "Ontem" for timestamps from yesterday', () => {
    expect(formatDayLabel(new Date(2026, 4, 29, 18, 30).getTime())).toBe('Ontem')
  })

  it('returns the full date for older timestamps', () => {
    const timestamp = new Date(2026, 4, 28, 10, 0).getTime()

    expect(formatDayLabel(timestamp)).toBe(
      new Date(timestamp).toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    )
  })
})

describe('formatTime', () => {
  it('formats timestamps as pt-BR time', () => {
    const timestamp = new Date(2026, 4, 30, 14, 30).getTime()

    expect(formatTime(timestamp)).toBe(
      new Date(timestamp).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    )
  })
})
