import { z } from 'zod'
import { BookName } from '~/utils/book'

export const chapterHistorySchema = z.object({
  book: z.enum(BookName),
  chapter: z.number(),
  verse: z.number().optional(),
  versionName: z.string(),
  timestamp: z.number()
})

