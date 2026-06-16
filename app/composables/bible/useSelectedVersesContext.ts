import type { BookAbbreviationType } from '~/utils/bible/book'

export interface SelectedVersesContext {
  selectedVerses: Ref<number[]>
  displayedVerseNumbers: ComputedRef<number[]>
  bookAbbreviation: ComputedRef<BookAbbreviationType>
  chapterNumber: ComputedRef<number>
  bookName: ComputedRef<string>
}

const SELECTED_VERSES_CONTEXT_KEY = Symbol('selectedVersesContext') as InjectionKey<SelectedVersesContext>

export function provideSelectedVersesContext(context: SelectedVersesContext) {
  provide(SELECTED_VERSES_CONTEXT_KEY, context)
}

export function useSelectedVersesContext(): SelectedVersesContext {
  const context = inject(SELECTED_VERSES_CONTEXT_KEY)

  if (!context) {
    throw new Error('useSelectedVersesContext must be used within a provider')
  }

  return context
}
