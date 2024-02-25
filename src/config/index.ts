import 'dotenv/config'
import { z } from 'zod'

export const NODE_ENV = z.string().parse(process.env['NODE_ENV'])
export const PORT = z.coerce.number().parse(process.env['PORT'])
export const CORS_ORIGIN = z.string().parse(process.env['CORS_ORIGIN'])

const zDatabaseCredentials = z.object({
  user: z.string(),
  pass: z.string(),
  host: z.string(),
  port: z.coerce.number(),
  name: z.string()
})

export const databaseCredentials = zDatabaseCredentials.parse({
  user: NODE_ENV === 'prod' ? process.env['DATABASE_USER'] : process.env['DEV_DATABASE_USER'],
  pass: NODE_ENV === 'prod' ? process.env['DATABASE_PASS'] : process.env['DEV_DATABASE_PASS'],
  host: NODE_ENV === 'prod' ? process.env['DATABASE_HOST'] : process.env['DEV_DATABASE_HOST'],
  port: NODE_ENV === 'prod' ? process.env['DATABASE_PORT'] : process.env['DEV_DATABASE_PORT'],
  name: NODE_ENV === 'prod' ? process.env['DATABASE_NAME'] : process.env['DEV_DATABASE_NAME']
})
