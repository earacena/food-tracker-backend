import { type NextFunction, type Request, type Response } from 'express'
import supertest from 'supertest'
import { randomUUID } from 'crypto'
import { db } from '../../utils/db'
import app from '../../app'

const api = supertest(app.expressApp)

jest.mock('../../middleware/authenticate.ts', () => jest.fn((req: Request, _res: Response, next: NextFunction) => {
  req.body.token = 'token'
  next()
}))

describe('MealEntry API', () => {
  const userId1 = randomUUID()
  const userId2 = randomUUID()

  beforeAll(async () => {
    await db.schema
      .createTable('mealEntry')
      .addColumn('id', 'integer', (cb) => cb.autoIncrement().primaryKey())
      .addColumn('userId', 'text', (cb) => cb.notNull())
      .addColumn('mealId', 'integer')
      .addColumn('foodItemId', 'integer')
      .addColumn('quantityInGrams', 'integer')
      .addColumn('quantityInUnits', 'integer')
      .execute()

    // Add test data
    await db.insertInto('mealEntry')
      .values({
        userId: userId1,
        foodItemId: 1,
        mealId: 1,
        quantityInGrams: null,
        quantityInUnits: 2
      })
      .execute()

    await db.insertInto('mealEntry')
      .values({
        userId: userId1,
        foodItemId: 2,
        mealId: 1,
        quantityInGrams: 100,
        quantityInUnits: null
      })
      .execute()

    await db.insertInto('mealEntry')
      .values({
        userId: userId2,
        foodItemId: 1,
        mealId: 2,
        quantityInGrams: null,
        quantityInUnits: 200
      })
      .execute()
  })

  afterAll(async () => {
    await db.schema
      .dropTable('mealEntry')
      .execute()
  })

  describe('when retrieving mealEntry', () => {
    test('should return mealEntry with given id', async () => {
      const response = await api
        .get('/api/mealEntries/1')
        .expect(200)

      const responseData = JSON.parse(response.text)
      expect(responseData).toStrictEqual({
        success: true,
        data: {
          mealEntry: {
            id: 1,
            userId: userId1,
            foodItemId: 1,
            mealId: 1,
            quantityInUnits: 2,
            quantityInGrams: null
          }
        }
      })
    })

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
              userId: userId1,
              foodItemId: 1,
              mealId: 1,
              quantityInGrams: null,
              quantityInUnits: 2
            },
            {
              id: 2,
              userId: userId1,
              foodItemId: 2,
              mealId: 1,
              quantityInGrams: 100,
              quantityInUnits: null
            }
          ]
        }
      })
    })

    test('should return meal entries with given userId', async () => {
      const response = await api
        .get(`/api/mealEntries/user/${userId2}`)
        .expect(200)

      const responseData = JSON.parse(response.text)
      expect(responseData).toStrictEqual({
        success: true,
        data: {
          userMealEntries: [
            {
              id: 3,
              userId: userId2,
              foodItemId: 1,
              mealId: 2,
              quantityInGrams: null,
              quantityInUnits: 200
            }
          ]
        }
      }
      )
    })
  })

  describe('when creating mealEntry', () => {
    test('should create mealEntry and return it', async () => {
      const response = await api
        .post('/api/mealEntries/')
        .send({
          userId: userId2,
          mealId: 3,
          foodItemId: 10,
          quantityInGrams: 30,
          quantityInUnits: null
        })
        .expect(201)

      const responseData = JSON.parse(response.text)
      expect(responseData).toStrictEqual({
        success: true,
        data: {
          newMealEntry: {
            id: 4,
            userId: userId2,
            foodItemId: 10,
            mealId: 3,
            quantityInGrams: 30,
            quantityInUnits: null
          }
        }
      })
    })
  })

  describe('when deleting mealEntry', () => {
    test('should delete mealEntry', async () => {
      await api
        .delete('/api/mealEntries/1')
        .expect(204)

      const response = await api
        .get('/api/mealEntries/1')
        .expect(404)

      const responseData = JSON.parse(response.text)
      expect(responseData).toStrictEqual({
        success: false,
        errorMessage: 'mealEntry not found'
      })
    })

    test('should delete meal entries with given meal id', async () => {
      await api
        .delete('/api/mealEntries/meal/2')
        .expect(204)

      const response = await api
        .get('/api/mealEntries/meal/2')
        .expect(200)

      const responseData = JSON.parse(response.text)
      expect(responseData).toStrictEqual({
        success: true,
        data: {
          mealEntries: []
        }
      })
    })
  })
})
