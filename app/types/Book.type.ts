import { z } from 'zod'
import type { BookSchema } from "./schemas/Book.schema";

export type Book = z.infer<typeof BookSchema>