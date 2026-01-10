import { z } from 'zod'
import { BookAbbreviation } from '~/utils/book'

export const verseSchema = z.object({
  id: z.int(),
  number: z.int(),
  text: z.string(),
})

export const verseSelectionSchema = z.object({
  book: z.enum(BookAbbreviation),
  chapter: z.number().int().positive(),
  verse: z.number().int().positive(),
})
