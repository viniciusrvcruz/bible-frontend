import { z } from 'zod'
import { bookSchema, bookWithChaptersSchema } from './Book.schema'

export type Book = z.infer<typeof bookSchema>
export type BookWithChapters = z.infer<typeof bookWithChaptersSchema>
