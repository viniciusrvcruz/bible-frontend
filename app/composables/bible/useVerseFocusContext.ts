export interface VerseFocusContext {
  focusVerseByNumber: (verseNumber: number, shouldScrollIntoVerse?: boolean) => void
  clearFocus: () => void
}

const VERSE_FOCUS_CONTEXT_KEY = Symbol('verseFocusContext') as InjectionKey<VerseFocusContext>

export function provideVerseFocusContext(context: VerseFocusContext) {
  provide(VERSE_FOCUS_CONTEXT_KEY, context)
}

export function useVerseFocusContext(): VerseFocusContext {
  const context = inject(VERSE_FOCUS_CONTEXT_KEY)

  if (!context) {
    throw new Error('useVerseFocusContext must be used within a provider')
  }

  return context
}
