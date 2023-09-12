import { randomUUID } from 'crypto'
import supertest from 'supertest'
import { db } from '../../utils/db'
import app from '../../app'
import type { NextFunction, Request, Response } from 'express'

const api = supertest(app.expressApp)

jest.mock('../../middleware/authenticate.ts', () => jest.fn((req: Request, _res: Response, next: NextFunction) => {
  req.body.token = 'token'
  next()
}))

describe('Activity API', () => {
  const currentTimestamp = new Date().toISOString()
  const userId1 = randomUUID()
  const userId2 = randomUUID()

  beforeAll(async () => {
    await db.schema.createTable('activity')
      .addColumn('id', 'integer', (cb) => cb.autoIncrement().primaryKey())
      .addColumn('userId', 'uuid', (cb) => cb.notNull())
      .addColumn('foodItemId', 'integer')
      .addColumn('mealId', 'integer')
      .addColumn('quantity', 'integer', (cb) => cb.notNull())
      .addColumn('createdAt', 'timestamp', (cb) =>
        cb.notNull().defaultTo(currentTimestamp) // Sqlite3 specific timestamp
      )
      .execute()

    // Add test data
    await db.insertInto('activity')
      .values({
        id: 1,
        userId: userId1,
        foodItemId: 1,
        quantity: 3,
        createdAt: currentTimestamp
      })
      .executeTakeFirst()

    await db.insertInto('activity')
      .values({
        id: 2,
        userId: userId2,
        mealId: 1,
        quantity: 1,
        createdAt: currentTimestamp
      })
      .executeTakeFirst()
  })

  describe('when retrieving activities', () => {
    test('should return activity with given id', async () => {
      const response = await api
        .get('/api/activities/1')
        .expect(200)

      const responseData = JSON.parse(response.text)
      expect(responseData).toStrictEqual({
        success: true,
        data: {
          activity: {
            id: 1,
            userId: userId1,
            foodItemId: 1,
            mealId: null,
            quantity: 3,
            createdAt: currentTimestamp
          }
        }
      })
    })

    test('should return activities associated with userId', async () => {
      const response = await api
        .get(`/api/activities/user/${userId2}`)
        .expect(200)

      const responseData = JSON.parse(response.text)
      expect(responseData).toStrictEqual({
        success: true,
        data: {
          userActivities: [
            {
              id: 2,
              userId: userId2,
              foodItemId: null,
              mealId: 1,
              quantity: 1,
              createdAt: currentTimestamp
            }
          ]
        }
      })
    })

    test('should return 404 when fetching activity that doesn\'t exist', async () => {
      const response = await api
        .get('/api/activities/1000')
        .expect(404)

      const responseData = JSON.parse(response.text)
      expect(responseData).toStrictEqual({
        success: false,
        errorMessage: 'activity not found'
      })
    })
  })

  describe('when creating activities', () => {
    test('should create and return new activity', async () => {
      const response = await api
        .post('/api/activities/')
        .send({
          userId: userId2,
          foodItemId: 10,
          mealId: null,
          quantity: 2,
          createdAt: currentTimestamp
        })
        .expect(201)

      const responseData = JSON.parse(response.text)
      expect(responseData).toStrictEqual({
        success: true,
        data: {
          newActivity: {
            id: 3,
            userId: userId2,
            foodItemId: 10,
            mealId: null,
            quantity: 2,
            createdAt: currentTimestamp
          }
        }
      })
    })
  })

  describe('when deleting activities', () => {
    test('should delete activity', async () => {
      await api
        .delete('/api/activities/1')
        .expect(204)

      const response = await api
        .get('/api/activities/1')
        .expect(404)

      const responseData = JSON.parse(response.text)
      expect(responseData).toStrictEqual({
        success: false,
        errorMessage: 'activity not found'
      })
    })
  })
})
