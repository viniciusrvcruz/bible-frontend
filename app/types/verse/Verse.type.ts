import { z } from 'zod'
import { VerseSchema } from './Verse.schema'

export type VerseSelection = z.infer<typeof VerseSchema>

