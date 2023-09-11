import { db } from '../../utils/db'
import supertest from 'supertest'
import app from '../../app'
import type { NextFunction, Request, Response } from 'express'

const api = supertest(app.expressApp)

jest.mock('../../middleware/authenticate.ts', () => jest.fn((req: Request, _res: Response, next: NextFunction) => {
  req.body.token = 'token'
  next()
}))

describe('FoodItem API', () => {
  const currentTimestamp = new Date().toISOString()

  beforeAll(async () => {
    await db.schema.createTable('foodItem')
      .addColumn('id', 'integer', (cb) => cb.autoIncrement().primaryKey())
      .addColumn('foodName', 'text', (cb) => cb.notNull())
      .addColumn('userId', 'integer', (cb) => cb.notNull())
      .addColumn('caloriesPerServing', 'integer', (cb) => cb.notNull())
      .addColumn('servingSizeInGrams', 'integer')
      .addColumn('servingSizeInUnits', 'integer')
      .addColumn('searchVisibility', 'varchar(10)', (cb) => cb.notNull())
      .addColumn('createdAt', 'timestamp', (cb) =>
        cb.notNull().defaultTo(currentTimestamp) // Sqlite3 specific timestamp
      )
      .execute()

    // Add test data
    await db.insertInto('foodItem')
      .values({
        id: 1,
        foodName: 'Apple',
        userId: 321,
        caloriesPerServing: 100,
        servingSizeInGrams: 150,
        createdAt: currentTimestamp,
        searchVisibility: 'private'
      })
      .executeTakeFirst()

    await db.insertInto('foodItem')
      .values({
        id: 2,
        foodName: 'Banana',
        userId: 323,
        caloriesPerServing: 1000,
        servingSizeInUnits: 1,
        createdAt: currentTimestamp,
        searchVisibility: 'public'
      })
      .executeTakeFirst()
  })

  describe('when retrieving foodItems', () => {
    test('should return foodItem with given id', async () => {
      const response = await api
        .get('/api/foodItems/1')
        .expect(200)

      const responseData = JSON.parse(response.text)
      expect(responseData).toStrictEqual({
        success: true,
        data: {
          foodItem: {
            id: 1,
            foodName: 'Apple',
            userId: 321,
            caloriesPerServing: 100,
            servingSizeInGrams: 150,
            servingSizeInUnits: null,
            createdAt: currentTimestamp,
            searchVisibility: 'private'
          }
        }
      })
    })

    test('should return foodItems associated with userId', async () => {
      const response = await api
        .get('/api/foodItems/user/323')
        .expect(200)

      const responseData = JSON.parse(response.text)
      expect(responseData).toStrictEqual({
        success: true,
        data: {
          userFoodItems: [
            {
              id: 2,
              foodName: 'Banana',
              userId: 323,
              caloriesPerServing: 1000,
              servingSizeInGrams: null,
              servingSizeInUnits: 1,
              createdAt: currentTimestamp,
              searchVisibility: 'public'
            }
          ]
        }
      })
    })

    test('should return 404 when fetching foodItem that doesn\'t exist', async () => {
      const response = await api
        .get('/api/foodItems/1000')
        .expect(404)

      const responseData = JSON.parse(response.text)
      expect(responseData).toStrictEqual({
        success: false,
        errorMessage: 'foodItem not found'
      })
    })
  })

  describe('when creating foodItems', () => {
    test('should create and return new foodItem', async () => {
      const response = await api
        .post('/api/foodItems/')
        .send({
          foodName: 'Super Apple',
          userId: 323,
          caloriesPerServing: 2000,
          servingSizeInUnits: 3,
          servingSizeInGrams: null,
          createdAt: currentTimestamp,
          searchVisibility: 'private'
        })
        .expect(201)

      const responseData = JSON.parse(response.text)
      expect(responseData).toStrictEqual({
        success: true,
        data: {
          newFoodItem: {
            id: 3,
            foodName: 'Super Apple',
            userId: 323,
            caloriesPerServing: 2000,
            servingSizeInGrams: null,
            servingSizeInUnits: 3,
            createdAt: currentTimestamp,
            searchVisibility: 'private'
          }
        }
      })
    })
  })

  describe('when updating foodItems', () => {
    test('should update and return updated foodItem', async () => {
      const response = await api
        .put('/api/foodItems/1')
        .send({
          foodName: 'Good Apple',
          caloriesPerServing: 200,
          servingSizeInGrams: null,
          servingSizeInUnits: 1,
          searchVisibility: 'public'
        })
        .expect(200)

      const responseData = JSON.parse(response.text)
      expect(responseData).toStrictEqual({
        success: true,
        data: {
          updatedFoodItem: {
            id: 1,
            foodName: 'Good Apple',
            userId: 321,
            caloriesPerServing: 200,
            servingSizeInGrams: null,
            servingSizeInUnits: 1,
            createdAt: currentTimestamp,
            searchVisibility: 'public'
          }
        }
      })
    })
  })

  describe('when deleting foodItems', () => {
    test('should delete foodItem', async () => {
      await api
        .delete('/api/foodItems/1')
        .expect(204)

      const response = await api
        .get('/api/foodItems/1')
        .expect(404)

      const responseData = JSON.parse(response.text)
      expect(responseData).toStrictEqual({
        success: false,
        errorMessage: 'foodItem not found'
      })
    })
  })
})
