import { z } from 'zod'
import { chapterSelectionSchema, chapterSchema } from './Chapter.schema'

export type Chapter = z.infer<typeof chapterSchema>
export type ChapterSelection = z.infer<typeof chapterSelectionSchema>
