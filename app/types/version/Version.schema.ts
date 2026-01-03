import { z } from 'zod'

export const VersionSchema = z.object({
  id: z.int(),
  name: z.string(),
  full_name: z.string(),
  language: z.enum(['pt_br', 'en']),
  copyright: z.string(),
  chapters_count: z.int().optional(),
  verses_count: z.int().optional(),
})

