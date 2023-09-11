import { db } from '../../utils/db'
import ActivityRepository from './activity.repository'
import { zActivities } from './activity.types'
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
      .addColumn('createdAt', 'timestamp', (cb) => cb.notNull().defaultTo(currentTimestamp))
      .execute()

    // Add test data
    await db.insertInto('activity')
      .values({
        userId: userId1,
        foodItemId: 1
      })
      .execute()

    await db.insertInto('activity')
      .values({
        userId: userId1,
        mealId: 2
      })
      .execute()

    await db.insertInto('activity')
      .values({
        userId: userId2,
        foodItemId: 2
      })
      .execute()
  })

  afterAll(async () => {
    await db.schema
      .dropTable('activity')
      .execute()
  })

  test('should return all user\'s activities by userId', async () => {
    const activities = zActivities.parse(await ActivityRepository.findActivitiesByUserId(userId1))

    expect(activities).toStrictEqual([
      {
        id: 1,
        userId: userId1,
        foodItemId: 1,
        mealId: null,
        createdAt: currentTimestamp
      },
      {
        id: 2,
        userId: userId1,
        mealId: 2,
        foodItemId: null,
        createdAt: currentTimestamp
      }
    ])
  })
})
