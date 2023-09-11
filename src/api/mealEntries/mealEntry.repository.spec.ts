import { randomUUID } from 'crypto'
import { db } from '../../utils/db'
import MealEntryRepository from './mealEntry.repository'
import { zMealEntries, zMealEntry } from './mealEntry.types'
import { MealEntryNotFoundError } from '../../utils/errors'

describe('MealEntry Repository', () => {
  const userId1 = randomUUID()
  const userId2 = randomUUID()

  beforeAll(async () => {
    await db.schema
      .createTable('mealEntry')
      .addColumn('id', 'integer', (cb) => cb.autoIncrement().primaryKey())
      .addColumn('userId', 'uuid', (cb) => cb.notNull())
      .addColumn('mealId', 'integer')
      .addColumn('foodItemId', 'integer')
      .execute()

    // Add test data
    await db.insertInto('mealEntry')
      .values({
        userId: userId1,
        foodItemId: 1,
        mealId: 1
      })
      .execute()

    await db.insertInto('mealEntry')
      .values({
        userId: userId1,
        foodItemId: 2,
        mealId: 1
      })
      .execute()

    await db.insertInto('mealEntry')
      .values({
        userId: userId2,
        foodItemId: 1,
        mealId: 2
      })
      .execute()
  })

  afterAll(async () => {
    await db.schema
      .dropTable('mealEntry')
      .execute()
  })

  test('should return mealEntry with given id', async () => {
    const mealEntry = zMealEntry.parse(await MealEntryRepository.findMealEntryById(1))

    expect(mealEntry).toStrictEqual({
      id: 1,
      userId: userId1,
      foodItemId: 1,
      mealId: 1
    })
  })

  test('should throw an error if mealEntry is not found', async () => {
    try {
      await MealEntryRepository.findMealEntryById(1111)
      throw new Error()
    } catch (err: unknown) {
      expect(err).toBeInstanceOf(MealEntryNotFoundError)
    }
  })

  test('should return all meal entries for given mealId', async () => {
    const mealEntries = zMealEntries.parse(await MealEntryRepository.findAllMealEntriesByMealId(1))

    expect(mealEntries).toStrictEqual([
      {
        id: 1,
        userId: userId1,
        foodItemId: 1,
        mealId: 1
      },
      {
        id: 2,
        userId: userId1,
        foodItemId: 2,
        mealId: 1
      }
    ])
  })

  test('should create a meal entry and return it', async () => {
    const newMealEntry = zMealEntry.parse(await MealEntryRepository.createMealEntry({
      userId: userId1,
      mealId: 10
    }))

    expect(newMealEntry).toStrictEqual({
      id: 4,
      userId: userId1,
      foodItemId: null,
      mealId: 10
    })
  })

  test('should delete a meal entry', async () => {
    await MealEntryRepository.deleteMealEntry(1)

    try {
      await MealEntryRepository.findMealEntryById(1)
      throw new Error()
    } catch (err: unknown) {
      expect(err).toBeInstanceOf(MealEntryNotFoundError)
    }
  })
})
