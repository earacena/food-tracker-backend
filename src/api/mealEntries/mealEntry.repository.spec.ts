import { db } from '../../utils/db'
import MealEntryRepository from './mealEntry.repository'
import { zMealEntries } from './mealEntry.types'

describe('MealEntry Repository', () => {
  beforeAll(async () => {
    await db.schema
      .createTable('mealEntry')
      .addColumn('id', 'integer', (cb) => cb.autoIncrement().primaryKey())
      .addColumn('userId', 'integer', (cb) => cb.notNull())
      .addColumn('mealId', 'integer', (cb) => cb.notNull())
      .addColumn('foodItemId', 'integer', (cb) => cb.notNull())
      .execute()

    // Add test data
    await db.insertInto('mealEntry')
      .values({
        userId: 1,
        foodItemId: 1,
        mealId: 1
      })
      .execute()

    await db.insertInto('mealEntry')
      .values({
        userId: 1,
        foodItemId: 2,
        mealId: 1
      })
      .execute()

    await db.insertInto('mealEntry')
      .values({
        userId: 2,
        foodItemId: 1,
        mealId: 2
      })
      .execute()
  })

  afterAll(async () => {
    await db.schema
      .dropTable('mealEntry')
      .execute()
  })

  test('should return all meal entries for given mealId', async () => {
    const mealEntries = zMealEntries.parse(await MealEntryRepository.findAllMealEntriesByMealId(1))

    expect(mealEntries).toStrictEqual([
      {
        id: 1,
        userId: 1,
        foodItemId: 1,
        mealId: 1
      },
      {
        id: 2,
        userId: 1,
        foodItemId: 2,
        mealId: 1
      }
    ])
  })
})
