import { z } from 'zod'
import { verseSelectionSchema, verseSchema } from './Verse.schema'

export type Verse = z.infer<typeof verseSchema>
export type VerseSelection = z.infer<typeof verseSelectionSchema>
