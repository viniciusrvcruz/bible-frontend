import { z } from 'zod'
import { ChapterSchema } from './Chapter.schema'

export type ChapterSelection = z.infer<typeof ChapterSchema>

