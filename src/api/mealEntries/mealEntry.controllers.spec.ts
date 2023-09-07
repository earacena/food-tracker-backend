import supertest from 'supertest'
import { db } from '../../utils/db'
import app from '../../app'

const api = supertest(app.expressApp)

describe('MealEntry API', () => {
  beforeAll(async () => {
    await db.schema
      .createTable('mealEntry')
      .addColumn('id', 'integer', (cb) => cb.autoIncrement().primaryKey())
      .addColumn('userId', 'integer', (cb) => cb.notNull())
      .addColumn('mealId', 'integer')
      .addColumn('foodItemId', 'integer')
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

  describe('when retrieving mealEntry', () => {
    test('should return meal entries with given mealId', async () => {
      const response = await api
        .get('/api/mealEntries/meal/1')
        .expect(200)

      const responseData = JSON.parse(response.text)
      expect(responseData).toStrictEqual({
        success: true,
        data: {
          mealEntries: [
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
          ]
        }
      })
    })
  })
})
