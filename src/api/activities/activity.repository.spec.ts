import { db } from '../../utils/db'
import { ActivityNotFoundError } from '../../utils/errors'
import ActivityRepository from './activity.repository'
import { zActivities, zActivity } from './activity.types'
import { randomUUID } from 'crypto'

describe('Activity Repository', () => {
  const currentTimestamp = new Date()
  const userId1 = randomUUID()
  const userId2 = randomUUID()

  beforeAll(async () => {
    await db.schema
      .createTable('activity')
      .addColumn('id', 'integer', (cb) => cb.autoIncrement().primaryKey())
      .addColumn('userId', 'uuid', (cb) => cb.notNull())
      .addColumn('mealId', 'integer')
      .addColumn('foodItemId', 'integer')
      .addColumn('quantityInGrams', 'integer')
      .addColumn('quantityInUnits', 'integer')
      .addColumn('createdAt', 'timestamp', (cb) => cb.notNull().defaultTo(currentTimestamp))
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

  afterAll(async () => {
    await db.schema
      .dropTable('activity')
      .execute()
  })

  test('should return activity with given id', async () => {
    const activity = zActivity.parse(await ActivityRepository.findActivityById(1))

    expect(activity).toStrictEqual({
      id: 1,
      userId: userId1,
      foodItemId: 1,
      mealId: null,
      quantityInGrams: 20,
      quantityInUnits: null,
      createdAt: currentTimestamp
    })
  })

  test('should return all user\'s activities by userId', async () => {
    const activities = zActivities.parse(await ActivityRepository.findActivitiesByUserId(userId1))

    expect(activities).toStrictEqual([
      {
        id: 1,
        userId: userId1,
        foodItemId: 1,
        mealId: null,
        quantityInGrams: 20,
        quantityInUnits: null,
        createdAt: currentTimestamp
      },
      {
        id: 2,
        userId: userId1,
        mealId: 2,
        foodItemId: null,
        quantityInGrams: null,
        quantityInUnits: 1,
        createdAt: currentTimestamp
      }
    ])
  })

  test('should create an activity and return it', async () => {
    const newActivity = zActivity.parse(await ActivityRepository.createActivity({
      userId: userId1,
      foodItemId: 10,
      quantityInGrams: 100
    }))

    expect(newActivity).toStrictEqual({
      id: 4,
      userId: userId1,
      foodItemId: 10,
      mealId: null,
      quantityInGrams: 100,
      quantityInUnits: null,
      createdAt: currentTimestamp
    })
  })

  test('should delete an activity', async () => {
    await ActivityRepository.deleteActivity(1)

    try {
      await ActivityRepository.findActivityById(1)
      throw new Error()
    } catch (err: unknown) {
      expect(err).toBeInstanceOf(ActivityNotFoundError)
    }
  })
})
