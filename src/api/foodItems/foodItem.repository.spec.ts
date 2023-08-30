import { sql } from 'kysely'
import { db } from '../../utils/db'
import FoodItemRepository from './foodItem.repository'

describe('FoodItem Repository', () => {
  beforeAll(async () => {
    await db.schema.createTable('foodItem')
      .addColumn('id', 'serial', (cb) => cb.primaryKey())
      .addColumn('foodName', 'text', (cb) => cb.notNull())
      .addColumn('userId', 'integer', (cb) => cb.notNull())
      .addColumn('caloriesPerServing', 'integer', (cb) => cb.notNull())
      .addColumn('servingSizeInGrams', 'integer')
      .addColumn('servingSizeInUnits', 'integer')
      .addColumn('searchVisibility', 'varchar(10)', (cb) => cb.notNull())
      .addColumn('createdAt', 'timestamp', (cb) =>
        cb.notNull().defaultTo(sql`CURRENT_TIMESTAMP`) // Sqlite3 specific timestamp
      )
      .execute()

    // Add test data
    await db.insertInto('foodItem')
      .values({
        id: 123,
        foodName: 'Apple',
        userId: 321,
        caloriesPerServing: 100,
        servingSizeInGrams: 150,
        searchVisibility: 'private'
      })
      .executeTakeFirst()

    await db.insertInto('foodItem')
      .values({
        id: 124,
        foodName: 'Banana',
        userId: 323,
        caloriesPerServing: 1000,
        servingSizeInUnits: 1,
        searchVisibility: 'public'
      })
      .executeTakeFirst()
  })

  test('should find foodItem with a given id', async () => {
    await FoodItemRepository.findFoodItemById(123)
  })

  test('should find all foodItems belonging to user', async () => {
    await FoodItemRepository.findFoodItemsByUserId(321)
  })

  test('should update foodItem with given id', async () => {
    await FoodItemRepository.updateFoodItem(123, { foodName: 'Super Apple' })
  })

  test('should create a foodItem', async () => {
    await FoodItemRepository.createFoodItem({
      foodName: 'New Apple',
      userId: 321,
      caloriesPerServing: 150,
      servingSizeInUnits: 1,
      searchVisibility: 'public'
    })
  })

  test('should delete foodItem with given id', async () => {
    await FoodItemRepository.deleteFoodItem(123)
  })
})
