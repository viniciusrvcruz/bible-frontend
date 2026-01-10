import { z } from 'zod'
import { BookAbbreviation } from '~/utils/book'

export const chapterInBookSchema = z.object({
  id: z.int(),
  number: z.int(),
  verses_count: z.int(),
})

export const bookSchema = z.object({
  id: z.int(),
  name: z.string(),
  abbreviation: z.enum(BookAbbreviation),
  order: z.int(),
  chapters: z.array(chapterInBookSchema).optional(),
})

export const bookWithChaptersSchema = z.object({
  id: z.int(),
  name: z.string(),
  abbreviation: z.enum(BookAbbreviation),
  order: z.int(),
  chapters: z.array(chapterInBookSchema),
})
