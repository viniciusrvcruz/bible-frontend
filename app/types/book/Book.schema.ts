import { z } from 'zod'

export const bookSchema = z.object({
  id: z.int(),
  name: z.enum(BookName),
  order: z.int(),
})

export const bookInfoSchema = z.object({
  name: z.string(),
  chapters: z.int(),
})
