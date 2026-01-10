import { z } from 'zod'

export const VersionSchema = z.object({
  id: z.int(),
  abbreviation: z.string(),
  name: z.string(),
  language: z.enum(['pt_br', 'en']),
  copyright: z.string(),
})

