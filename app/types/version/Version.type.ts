import { z } from 'zod'
import { VersionSchema } from './Version.schema'

export type Version = z.infer<typeof VersionSchema>

