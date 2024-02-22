import supertest from 'supertest'
import { db } from '../../utils/db'
import { randomUUID } from 'crypto'
import app from '../../app'
import type { NextFunction, Request, Response } from 'express'

const api = supertest(app.expressApp)

jest.mock('../../middleware/authenticate.ts', () => jest.fn((req: Request, _res: Response, next: NextFunction) => {
  req.body.token = 'token'
  next()
}))

describe('Profile API', () => {
  const currentTimestamp = new Date().toISOString()

  const userId1 = randomUUID()
  const userId2 = randomUUID()
  const userId3 = randomUUID()

  beforeAll(async () => {
    await db.schema.createTable('profile')
      .addColumn('userId', 'text', (cb) => cb.notNull())
      .addColumn('dailyCalorieGoal', 'integer')
      .addColumn('createdAt', 'timestamp', (cb) => cb.notNull().defaultTo(currentTimestamp))
      .execute()

    // add test data
    await db.insertInto('profile')
      .values({
        userId: userId1,
        dailyCalorieGoal: 3000
      })
      .execute()

    await db.insertInto('profile')
      .values({
        userId: userId2,
        dailyCalorieGoal: 2000
      })
      .execute()

    await db.insertInto('profile')
      .values({
        userId: userId3,
        dailyCalorieGoal: 2500
      })
      .execute()
  })

  afterAll(async () => {
    await db.schema
      .dropTable('profile')
      .execute()
  })

  describe('when retrieving profiles', () => {
    test('should return profile with given userId', async () => {
      const response = await api
        .get(`/api/profiles/${userId3}`)
        .expect(200)

      const responseData = JSON.parse(response.text)
      expect(responseData).toStrictEqual({
        success: true,
        data: {
          userProfile: {
            userId: userId3,
            dailyCalorieGoal: 2500,
            createdAt: currentTimestamp
          }
        }
      })
    })

    test('should return 404 when profile does not exist', async () => {
      const response = await api
        .get(`/api/profiles/${randomUUID()}`)
        .expect(404)

      const responseData = JSON.parse(response.text)
      expect(responseData).toStrictEqual({
        success: false,
        errorMessage: 'profile not found'
      })
    })
  })

  describe('when creating profiles', () => {
    test('should create a profile and return it', async () => {
      const newUserId = randomUUID()

      const response = await api
        .post('/api/profiles')
        .send({
          userId: newUserId,
          dailyCalorieGoal: 2200
        })
        .expect(201)

      const responseData = JSON.parse(response.text)
      expect(responseData).toStrictEqual({
        success: true,
        data: {
          newProfile: {
            userId: newUserId,
            dailyCalorieGoal: 2200,
            createdAt: currentTimestamp
          }
        }
      })
    })
  })

  describe('when updating profiles', () => {
    test('should update a profile with given userId', async () => {
      const response = await api
        .put(`/api/profiles/${userId1}`)
        .send({
          dailyCalorieGoal: 3200
        })
        .expect(200)

      const responseData = JSON.parse(response.text)
      expect(responseData).toStrictEqual({
        success: true,
        data: {
          updatedProfile: {
            userId: userId1,
            dailyCalorieGoal: 3200,
            createdAt: currentTimestamp
          }
        }
      })
    })
  })

  describe('when deleting profiles', () => {
    test('should delete a profile', async () => {
      await api
        .delete(`/api/profiles/${userId2}`)
        .expect(204)

      const response = await api
        .get(`/api/profiles/${userId2}`)
        .expect(404)

      const responseData = JSON.parse(response.text)
      expect(responseData).toStrictEqual({
        success: false,
        errorMessage: 'profile not found'
      })
    })
  })
})
