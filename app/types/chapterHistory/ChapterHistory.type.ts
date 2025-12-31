import { z } from 'zod'
import { chapterHistorySchema } from './ChapterHistory.schema'

export type ChapterHistory = z.infer<typeof chapterHistorySchema>

