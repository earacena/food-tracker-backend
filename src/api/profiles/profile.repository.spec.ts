import { randomUUID } from 'crypto'
import { db } from '../../utils/db'
import { zProfile } from './profile.types'
import ProfileRepository from './profile.repository'
import { NotFoundError } from '../../utils/errors'

describe('Profile Repository', () => {
  const currentTimestamp = new Date()
  const userId1 = randomUUID()
  const userId2 = randomUUID()

  beforeAll(async () => {
    await db.schema.createTable('profile')
      .addColumn('userId', 'text', (cb) => cb.primaryKey())
      .addColumn('dailyCalorieGoal', 'integer')
      .addColumn('createdAt', 'timestamp', (cb) =>
        cb.notNull().defaultTo(currentTimestamp)
      )
      .execute()

    // Add test data
    await db.insertInto('profile')
      .values({
        userId: userId1,
        dailyCalorieGoal: 2300
      })
      .execute()

    await db.insertInto('profile')
      .values({
        userId: userId2,
        dailyCalorieGoal: 2000
      })
      .execute()
  })

  afterAll(async () => {
    await db.schema.dropTable('profile').execute()
  })

  test('should return profile with a given id', async () => {
    const profile = zProfile.parse(await ProfileRepository.findProfileByUserId(userId1))

    expect(profile).toStrictEqual({
      userId: userId1,
      dailyCalorieGoal: 2300,
      createdAt: currentTimestamp
    })
  })

  test('should throw an error if profile is not found', async () => {
    try {
      await ProfileRepository.findProfileByUserId(crypto.randomUUID())
      throw new Error() // fails test if expected error is not thrown
    } catch (err: unknown) {
      expect(err).toBeInstanceOf(NotFoundError)
    }
  })

  test('should update profile with given id and return it', async () => {
    const updatedProfile = zProfile.parse(await ProfileRepository.updateProfile(userId2, { dailyCalorieGoal: 2800 }))

    expect(updatedProfile).toStrictEqual({
      userId: userId2,
      dailyCalorieGoal: 2800,
      createdAt: currentTimestamp
    })
  })

  test('should create a profile', async () => {
    const newUserId = crypto.randomUUID()
    const newProfile = zProfile.parse(await ProfileRepository.createProfile({
      userId: newUserId,
      dailyCalorieGoal: 2200
    }))

    expect(newProfile).toStrictEqual({
      userId: newUserId,
      dailyCalorieGoal: 2200,
      createdAt: currentTimestamp
    })
  })

  test('should delete profile with given id', async () => {
    await ProfileRepository.deleteProfile(userId1)

    try {
      await ProfileRepository.findProfileByUserId(userId1)
      throw new Error() // fails test if expected error is not thrown
    } catch (err: unknown) {
      expect(err).toBeInstanceOf(NotFoundError)
    }
  })
})
