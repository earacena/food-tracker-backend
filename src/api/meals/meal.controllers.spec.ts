import supertest from 'supertest'
import { db } from '../../utils/db'
import app from '../../app'

const api = supertest(app.expressApp)

describe('Meal API', () => {
  const currentTimestamp = new Date().toISOString()

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
        userId: 312,
        name: 'english breakfast'
      })
      .execute()

    await db.insertInto('meal')
      .values({
        id: 2,
        userId: 312,
        name: 'smoothie'
      })
      .execute()

    await db.insertInto('meal')
      .values({
        id: 3,
        userId: 234,
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
            userId: 312,
            name: 'english breakfast',
            createdAt: currentTimestamp
          }
        }
      })
    })

    test('should return meals with given userId', async () => {
      const response = await api
        .get('/api/meals/user/312')
        .expect(200)

      const responseData = JSON.parse(response.text)
      expect(responseData).toStrictEqual({
        success: true,
        data: {
          userMeals: [
            {
              id: 1,
              userId: 312,
              name: 'english breakfast',
              createdAt: currentTimestamp
            },
            {
              id: 2,
              userId: 312,
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
          userId: 312,
          name: 'simple lunch'
        })
        .expect(201)

      const responseData = JSON.parse(response.text)
      expect(responseData).toStrictEqual({
        success: true,
        data: {
          newMeal: {
            id: 4,
            userId: 312,
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
            userId: 312,
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
        success: false
      })
    })
  })
})
