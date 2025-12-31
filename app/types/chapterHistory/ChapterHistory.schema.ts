import { z } from 'zod'

export const chapterHistorySchema = z.object({
  book: z.string(),
  bookName: z.string(),
  chapter: z.number(),
  verse: z.number().optional(),
  versionName: z.string(),
  timestamp: z.number()
})

