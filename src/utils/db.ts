import { Kysely, PostgresDialect, SqliteDialect } from 'kysely'
import { Pool } from 'pg'
import SqliteDatabase from 'better-sqlite3'
import { NODE_ENV, databaseCredentials } from '../config'

import { type FoodItemTable } from '../api/foodItems/foodItem.model'
import { type MealTable } from '../api/meals/meal.model'
import { type MealEntryTable } from '../api/mealEntries/mealEntry.model'
import { type ActivityTable } from '../api/activities/activity.model'

interface Database {
  foodItem: FoodItemTable
  meal: MealTable
  mealEntry: MealEntryTable
  activity: ActivityTable
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
