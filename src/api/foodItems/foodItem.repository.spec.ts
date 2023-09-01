import { NoResultError } from 'kysely'
import { db } from '../../utils/db'
import FoodItemRepository from './foodItem.repository'
import { zFoodItem, zFoodItems } from './foodItem.types'

describe('FoodItem Repository', () => {
  const currentTimestamp = new Date()

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
        cb.notNull().defaultTo(currentTimestamp)
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
        searchVisibility: 'public'
      })
      .executeTakeFirst()

    await db.insertInto('foodItem')
      .values({
        id: 3,
        foodName: 'Pear',
        userId: 321,
        caloriesPerServing: 10,
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
      userId: 321,
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
      expect(err).toBeInstanceOf(NoResultError)
    }
  })

  test('should find all foodItems belonging to user', async () => {
    const foodItems = zFoodItems.parse(await FoodItemRepository.findFoodItemsByUserId(321))

    expect(foodItems).toStrictEqual([
      {
        id: 1,
        foodName: 'Apple',
        userId: 321,
        caloriesPerServing: 100,
        servingSizeInGrams: 150,
        servingSizeInUnits: null,
        createdAt: currentTimestamp,
        searchVisibility: 'private'
      },
      {
        id: 3,
        foodName: 'Pear',
        userId: 321,
        caloriesPerServing: 10,
        servingSizeInUnits: 1,
        servingSizeInGrams: null,
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
      userId: 321,
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
      userId: 321,
      caloriesPerServing: 150,
      servingSizeInUnits: 1,
      searchVisibility: 'public'
    }))

    expect(newFoodItem).toStrictEqual({
      id: 4,
      foodName: 'New Apple',
      userId: 321,
      caloriesPerServing: 150,
      servingSizeInUnits: 1,
      servingSizeInGrams: null,
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
      expect(err).toBeInstanceOf(NoResultError)
    }
  })
})
