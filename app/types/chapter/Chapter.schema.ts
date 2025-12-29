import { z } from 'zod'
import { BookName } from '~/utils/book'
import { bookSchema } from '../book/Book.schema'
import { VersionSchema } from '../version/Version.schema'
import { verseSchema } from '../verse/Verse.schema'

export const chapterBaseSchema = z.object({
  id: z.int(),
  number: z.int(),
  position: z.int(),
  book: bookSchema,
  version: VersionSchema.optional(),
  verses: z.array(verseSchema),
})

export const chapterSchema = chapterBaseSchema.extend({
  verses_count: z.int().optional(),
  previous: chapterBaseSchema.nullable().optional(),
  next: chapterBaseSchema.nullable().optional(),
})

export const chapterSelectionSchema = z.object({
  book: z.enum(BookName),
  chapter: z.number().int().positive(),
})
