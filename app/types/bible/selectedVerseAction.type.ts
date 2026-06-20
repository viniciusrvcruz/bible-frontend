type SelectedVerseIcon = 'copy' | 'compare'

export type SelectedVerseAction =
  | { label: string; icon: SelectedVerseIcon; action: () => void; component?: never }
  | { label: string; icon: SelectedVerseIcon; component: Component; action?: never }
