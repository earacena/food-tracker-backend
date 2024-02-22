import { randomUUID } from 'crypto'
import { db } from '../../utils/db'
import { zMeal, zMeals } from './meal.types'
import MealRepository from './meal.repository'
import { NotFoundError } from '../../utils/errors'

describe('Meal Repository', () => {
  const currentTimestamp = new Date()
  const userId = randomUUID()

  beforeAll(async () => {
    await db.schema.createTable('meal')
      .addColumn('id', 'integer', (cb) => cb.autoIncrement().primaryKey()) // Sqlite3 specific
      .addColumn('name', 'text', (cb) => cb.notNull())
      .addColumn('userId', 'text', (cb) => cb.notNull())
      .addColumn('createdAt', 'timestamp', (cb) =>
        cb.notNull().defaultTo(currentTimestamp)
      )
      .execute()

    // Add test data
    await db.insertInto('meal')
      .values({
        id: 1,
        userId,
        name: 'english breakfast'
      })
      .executeTakeFirst()

    await db.insertInto('meal')
      .values({
        id: 2,
        userId,
        name: 'smoothie'
      })
      .executeTakeFirst()
  })

  afterAll(async () => {
    await db.schema.dropTable('meal').execute()
  })

  test('should return meal with a given id', async () => {
    const meal = zMeal.parse(await MealRepository.findMealById(1))

    expect(meal).toStrictEqual({
      id: 1,
      userId,
      name: 'english breakfast',
      createdAt: currentTimestamp
    })
  })

  test('should throw an error if meal is not found', async () => {
    try {
      await MealRepository.findMealById(222)
      throw new Error() // fails test if expected error is not thrown
    } catch (err: unknown) {
      expect(err).toBeInstanceOf(NotFoundError)
    }
  })

  test('should return all meals belonging to user', async () => {
    const meals = zMeals.parse(await MealRepository.findMealsByUserId(userId))

    expect(meals).toStrictEqual([
      {
        id: 1,
        userId,
        name: 'english breakfast',
        createdAt: currentTimestamp
      },
      {
        id: 2,
        userId,
        name: 'smoothie',
        createdAt: currentTimestamp
      }
    ])
  })

  test('should update meal with given id and return it', async () => {
    const updatedMeal = zMeal.parse(await MealRepository.updateMeal(2, { name: 'apple smoothie' }))

    expect(updatedMeal).toStrictEqual({
      id: 2,
      userId,
      name: 'apple smoothie',
      createdAt: currentTimestamp
    })
  })

  test('should create a meal', async () => {
    const newMeal = zMeal.parse(await MealRepository.createMeal({
      name: 'Dinner',
      userId
    }))

    expect(newMeal).toStrictEqual({
      id: 3,
      userId,
      name: 'Dinner',
      createdAt: currentTimestamp
    })
  })

  test('should delete meal with given id', async () => {
    await MealRepository.deleteMeal(1)

    try {
      await MealRepository.findMealById(1)
      throw new Error() // fails test if expected error is not thrown
    } catch (err: unknown) {
      expect(err).toBeInstanceOf(NotFoundError)
    }
  })
})
