import 'dotenv/config'
import { z } from 'zod'

export const NODE_ENV = z.string().parse(process.env['NODE_ENV'])
export const PORT = z.coerce.number().parse(process.env['PORT'])

const zDatabaseCredentials = z.object({
  user: z.string(),
  pass: z.string(),
  host: z.string(),
  port: z.coerce.number(),
  name: z.string()
})

export const databaseCredentials = zDatabaseCredentials.parse({
  user: process.env['DATABASE_USER'],
  pass: process.env['DATABASE_PASS'],
  host: process.env['DATABASE_HOST'],
  port: process.env['DATABASE_PORT'],
  name: process.env['DATABASE_NAME']
})
