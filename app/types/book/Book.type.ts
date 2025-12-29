import { z } from 'zod'
import { bookInfoSchema, bookSchema } from './Book.schema'

export type Book = z.infer<typeof bookSchema>
export type BookInfo = z.infer<typeof bookInfoSchema>
