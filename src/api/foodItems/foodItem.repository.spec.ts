import { randomUUID } from 'crypto'
import { db } from '../../utils/db'
import FoodItemRepository from './foodItem.repository'
import { zFoodItem, zFoodItems } from './foodItem.types'
import { NotFoundError } from '../../utils/errors'

describe('FoodItem Repository', () => {
  const currentTimestamp = new Date()
  const userId1 = randomUUID()
  const userId2 = randomUUID()

  beforeAll(async () => {
    await db.schema.createTable('foodItem')
      .addColumn('id', 'integer', (cb) => cb.autoIncrement().primaryKey())
      .addColumn('foodName', 'text', (cb) => cb.notNull())
      .addColumn('userId', 'text', (cb) => cb.notNull())
      .addColumn('caloriesPerServing', 'integer', (cb) => cb.notNull())
      .addColumn('servingSizeInGrams', 'integer')
      .addColumn('servingSizeInUnits', 'integer')
      .addColumn('searchVisibility', 'varchar(10)', (cb) => cb.notNull())
      .addColumn('createdAt', 'timestamp', (cb) =>
        cb.notNull().defaultTo(currentTimestamp)
      )
      .execute()

    // Add test data
    await db.insertInto('foodItem')
      .values({
        id: 1,
        foodName: 'Apple',
        userId: userId1,
        caloriesPerServing: 100,
        servingSizeInGrams: 150,
        servingSizeInUnits: null,
        searchVisibility: 'private'
      })
      .executeTakeFirst()

    await db.insertInto('foodItem')
      .values({
        id: 2,
        foodName: 'Banana',
        userId: userId2,
        caloriesPerServing: 1000,
        servingSizeInGrams: 0,
        servingSizeInUnits: null,
        searchVisibility: 'public'
      })
      .executeTakeFirst()

    await db.insertInto('foodItem')
      .values({
        id: 3,
        foodName: 'Pear',
        userId: userId1,
        caloriesPerServing: 100,
        servingSizeInGrams: null,
        servingSizeInUnits: 1,
        searchVisibility: 'private'
      })
      .executeTakeFirst()

    await db.insertInto('foodItem')
      .values({
        id: 4,
        foodName: 'Egg',
        userId: userId2,
        caloriesPerServing: 80,
        servingSizeInGrams: null,
        servingSizeInUnits: 1,
        searchVisibility: 'private'
      })
      .executeTakeFirst()
  })

  afterAll(async () => {
    await db.schema.dropTable('foodItem').execute()
  })

  test('should find foodItem with a given id', async () => {
    const foodItem = zFoodItem.parse(await FoodItemRepository.findFoodItemById(1))

    expect(foodItem).toStrictEqual({
      id: 1,
      foodName: 'Apple',
      userId: userId1,
      caloriesPerServing: 100,
      servingSizeInGrams: 150,
      servingSizeInUnits: null,
      createdAt: currentTimestamp,
      searchVisibility: 'private'
    })
  })

  test('should throw an error if foodItem is not found', async () => {
    try {
      await FoodItemRepository.findFoodItemById(222)
      throw new Error() // fails test if expected error is not thrown
    } catch (err: unknown) {
      expect(err).toBeInstanceOf(NotFoundError)
    }
  })

  test('should find all foodItems belonging to user', async () => {
    const foodItems = zFoodItems.parse(await FoodItemRepository.findFoodItemsByUserId(userId1))

    expect(foodItems).toStrictEqual([
      {
        id: 1,
        foodName: 'Apple',
        userId: userId1,
        caloriesPerServing: 100,
        servingSizeInGrams: 150,
        servingSizeInUnits: null,
        createdAt: currentTimestamp,
        searchVisibility: 'private'
      },
      {
        id: 3,
        foodName: 'Pear',
        userId: userId1,
        caloriesPerServing: 100,
        servingSizeInGrams: null,
        servingSizeInUnits: 1,
        createdAt: currentTimestamp,
        searchVisibility: 'private'
      }
    ])
  })

  test('should update foodItem with given id and return it', async () => {
    const updatedFoodItem = zFoodItem.parse(await FoodItemRepository.updateFoodItem(1, { foodName: 'Super Apple' }))

    expect(updatedFoodItem).toStrictEqual({
      id: 1,
      foodName: 'Super Apple',
      userId: userId1,
      caloriesPerServing: 100,
      servingSizeInGrams: 150,
      servingSizeInUnits: null,
      createdAt: currentTimestamp,
      searchVisibility: 'private'
    })
  })

  test('should create a foodItem and return it', async () => {
    const newFoodItem = zFoodItem.parse(await FoodItemRepository.createFoodItem({
      foodName: 'New Apple',
      userId: userId1,
      caloriesPerServing: 150,
      servingSizeInGrams: 50,
      servingSizeInUnits: null,
      searchVisibility: 'public'
    }))

    expect(newFoodItem).toStrictEqual({
      id: 5,
      foodName: 'New Apple',
      userId: userId1,
      caloriesPerServing: 150,
      servingSizeInGrams: 50,
      servingSizeInUnits: null,
      createdAt: currentTimestamp,
      searchVisibility: 'public'
    })
  })

  test('should delete foodItem with given id', async () => {
    await FoodItemRepository.deleteFoodItem(1)

    try {
      await FoodItemRepository.findFoodItemById(1)
      throw new Error() // fails test if expected error was not thrown
    } catch (err: unknown) {
      expect(err).toBeInstanceOf(NotFoundError)
    }
  })
})
