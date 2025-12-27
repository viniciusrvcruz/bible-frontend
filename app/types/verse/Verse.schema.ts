import { z } from 'zod'
import { BookNameEnum } from '../book/Book.enum'

export const VerseSchema = z.object({
  book: z.enum(BookNameEnum),
  chapter: z.number().int().positive(),
  verse: z.number().int().positive(),
})

