import { z } from 'zod'

export const BookSchema = z.object({
  name: z.string(),
  chapters: z.int(),
})

