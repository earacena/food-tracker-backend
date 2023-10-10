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
      .addColumn('quantityInGrams', 'integer')
      .addColumn('quantityInUnits', 'integer')
      .addColumn('createdAt', 'timestamp', (cb) =>
        cb.notNull().defaultTo(currentTimestamp) // Sqlite3 specific timestamp
      )
      .execute()

    // Add test data
    await db.insertInto('activity')
      .values({
        userId: userId1,
        foodItemId: 1,
        quantityInGrams: 20
      })
      .execute()

    await db.insertInto('activity')
      .values({
        userId: userId1,
        mealId: 2,
        quantityInUnits: 1
      })
      .execute()

    await db.insertInto('activity')
      .values({
        userId: userId2,
        foodItemId: 2,
        quantityInGrams: 30
      })
      .execute()
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
            quantityInGrams: 20,
            quantityInUnits: null,
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
              id: 3,
              userId: userId2,
              foodItemId: 2,
              mealId: null,
              quantityInGrams: 30,
              quantityInUnits: null,
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
          quantityInGrams: 200,
          quantityInUnits: null
        })
        .expect(201)

      const responseData = JSON.parse(response.text)
      expect(responseData).toStrictEqual({
        success: true,
        data: {
          newActivity: {
            id: 4,
            userId: userId2,
            foodItemId: 10,
            mealId: null,
            quantityInGrams: 200,
            quantityInUnits: null,
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

    test('should delete activity', async () => {
      await api
        .delete('/api/activities/meal/2')
        .expect(204)

      const response = await api
        .get('/api/activities/2')
        .expect(404)

      const responseData = JSON.parse(response.text)
      expect(responseData).toStrictEqual({
        success: false,
        errorMessage: 'activity not found'
      })
    })
  })
})
