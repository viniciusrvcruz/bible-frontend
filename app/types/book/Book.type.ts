import { z } from 'zod'
import { BookSchema } from './Book.schema'

export type Book = z.infer<typeof BookSchema>

