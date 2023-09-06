import { db } from '../../utils/db'
import ActivityRepository from './activity.repository'
import { zActivities } from './activity.types'

describe('Activity Repository', () => {
  const currentTimestamp = new Date()

  beforeAll(async () => {
    await db.schema
      .createTable('activity')
      .addColumn('id', 'integer', (cb) => cb.autoIncrement().primaryKey())
      .addColumn('userId', 'integer', (cb) => cb.notNull())
      .addColumn('mealId', 'integer')
      .addColumn('foodItemId', 'integer')
      .addColumn('createdAt', 'timestamp', (cb) => cb.notNull().defaultTo(currentTimestamp))
      .execute()

    // Add test data
    await db.insertInto('activity')
      .values({
        userId: 1,
        foodItemId: 1
      })
      .execute()

    await db.insertInto('activity')
      .values({
        userId: 1,
        mealId: 2
      })
      .execute()

    await db.insertInto('activity')
      .values({
        userId: 2,
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
    const activities = zActivities.parse(await ActivityRepository.findActivitiesByUserId(1))

    expect(activities).toStrictEqual([
      {
        id: 1,
        userId: 1,
        foodItemId: 1,
        mealId: null,
        createdAt: currentTimestamp
      },
      {
        id: 2,
        userId: 1,
        mealId: 2,
        foodItemId: null,
        createdAt: currentTimestamp
      }
    ])
  })
})
