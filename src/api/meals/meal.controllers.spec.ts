import { randomUUID } from 'crypto'
import supertest from 'supertest'
import { db } from '../../utils/db'
import app from '../../app'
import { type NextFunction, type Request, type Response } from 'express'

const api = supertest(app.expressApp)

jest.mock('../../middleware/authenticate.ts', () => jest.fn((req: Request, _res: Response, next: NextFunction) => {
  req.body.token = 'token'
  next()
}))

describe('Meal API', () => {
  const currentTimestamp = new Date().toISOString()
  const userId1 = randomUUID()
  const userId2 = randomUUID()

  beforeAll(async () => {
    await db.schema.createTable('meal')
      .addColumn('id', 'integer', (cb) => cb.autoIncrement().primaryKey())
      .addColumn('userId', 'integer', (cb) => cb.notNull())
      .addColumn('name', 'text', (cb) => cb.notNull())
      .addColumn('createdAt', 'timestamp', (cb) => cb.notNull().defaultTo(currentTimestamp))
      .execute()

    // add test data
    await db.insertInto('meal')
      .values({
        id: 1,
        userId: userId1,
        name: 'english breakfast'
      })
      .execute()

    await db.insertInto('meal')
      .values({
        id: 2,
        userId: userId1,
        name: 'smoothie'
      })
      .execute()

    await db.insertInto('meal')
      .values({
        id: 3,
        userId: userId2,
        name: 'dinner'
      })
      .execute()
  })

  describe('when retrieving meals', () => {
    test('should return meal with given id', async () => {
      const response = await api
        .get('/api/meals/1')
        .expect(200)

      const responseData = JSON.parse(response.text)
      expect(responseData).toStrictEqual({
        success: true,
        data: {
          meal: {
            id: 1,
            userId: userId1,
            name: 'english breakfast',
            createdAt: currentTimestamp
          }
        }
      })
    })

    test('should return 404 when meal does not exist', async () => {
      const response = await api
        .get('/api/meals/123123')
        .expect(404)

      const responseData = JSON.parse(response.text)
      expect(responseData).toStrictEqual({
        success: false,
        errorMessage: 'meal not found'
      })
    })

    test('should return meals with given userId', async () => {
      const response = await api
        .get(`/api/meals/user/${userId1}`)
        .expect(200)

      const responseData = JSON.parse(response.text)
      expect(responseData).toStrictEqual({
        success: true,
        data: {
          userMeals: [
            {
              id: 1,
              userId: userId1,
              name: 'english breakfast',
              createdAt: currentTimestamp
            },
            {
              id: 2,
              userId: userId1,
              name: 'smoothie',
              createdAt: currentTimestamp
            }
          ]
        }
      })
    })
  })

  describe('when creating meals', () => {
    test('should create and return new meal', async () => {
      const response = await api
        .post('/api/meals/')
        .send({
          userId: userId1,
          name: 'simple lunch'
        })
        .expect(201)

      const responseData = JSON.parse(response.text)
      expect(responseData).toStrictEqual({
        success: true,
        data: {
          newMeal: {
            id: 4,
            userId: userId1,
            name: 'simple lunch',
            createdAt: currentTimestamp
          }
        }
      })
    })
  })

  describe('when updating meals', () => {
    test('should update and return updated meal', async () => {
      const response = await api
        .put('/api/meals/2')
        .send({
          name: 'small smoothie'
        })
        .expect(200)

      const responseData = JSON.parse(response.text)
      expect(responseData).toStrictEqual({
        success: true,
        data: {
          updatedMeal: {
            id: 2,
            userId: userId1,
            name: 'small smoothie',
            createdAt: currentTimestamp
          }
        }
      })
    })
  })

  describe('when deleting meals', () => {
    test('should delete meal', async () => {
      await api
        .delete('/api/meals/1')
        .expect(204)

      const response = await api
        .get('/api/meals/1')
        .expect(404)

      const responseData = JSON.parse(response.text)
      expect(responseData).toStrictEqual({
        success: false,
        errorMessage: 'meal not found'
      })
    })
  })
})
