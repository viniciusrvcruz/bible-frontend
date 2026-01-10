import { z } from 'zod'
import { BookAbbreviation } from '~/utils/book'

export const chapterHistorySchema = z.object({
  book: z.enum(BookAbbreviation),
  chapter: z.number(),
  verse: z.number().optional(),
  versionName: z.string(),
  timestamp: z.number()
})

