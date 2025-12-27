import { z } from 'zod'
import { BookNameEnum } from '../book/Book.enum'

export const ChapterSchema = z.object({
  book: z.enum(BookNameEnum),
  chapter: z.number().int().positive(),
})

