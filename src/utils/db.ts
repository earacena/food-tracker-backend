import { Kysely, PostgresDialect, SqliteDialect } from 'kysely'
import { Pool } from 'pg'
import SqliteDatabase from 'better-sqlite3'
import { NODE_ENV, databaseCredentials } from '../config'

import { type FoodItemTable } from '../api/foodItems/foodItem.model'

interface Database {
  foodItem: FoodItemTable
}

const mainDialect = new PostgresDialect({
  pool: new Pool({
    database: databaseCredentials.name,
    host: databaseCredentials.host,
    user: databaseCredentials.user,
    port: databaseCredentials.port,
    password: databaseCredentials.pass,
    max: 10
  })
})

// Database used for testing
const testDialect = new SqliteDialect({
  database: new SqliteDatabase(':memory:')
})

export const db = new Kysely<Database>({
  dialect: NODE_ENV === 'test' ? testDialect : mainDialect
})
