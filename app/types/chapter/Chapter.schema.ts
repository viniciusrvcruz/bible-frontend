import { z } from 'zod'
import { BookAbbreviation } from '~/utils/book'
import { bookSchema } from '../book/Book.schema'
import { VersionSchema } from '../version/Version.schema'
import { verseSchema } from '../verse/Verse.schema'

export const chapterSchema = z.object({
  id: z.int(),
  number: z.int(),
  book: bookSchema,
  version: VersionSchema.optional(),
  verses: z.array(verseSchema),
})

export const chapterSelectionSchema = z.object({
  book: z.enum(BookAbbreviation),
  chapter: z.number().int().positive(),
})
