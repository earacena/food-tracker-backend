import { db } from '../../utils/db'
import { NotFoundError } from '../../utils/errors'
import type {
  FoodItem,
  FoodItemUpdate,
  NewFoodItem
} from './foodItem.model'

export async function findFoodItemById (id: number): Promise<FoodItem> {
  return await db.selectFrom('foodItem')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirstOrThrow(() => new NotFoundError('foodItem'))
}

export async function findFoodItemsByUserId (userId: string): Promise<FoodItem[]> {
  return await db.selectFrom('foodItem')
    .where('userId', '=', userId)
    .selectAll()
    .execute()
}

export async function createFoodItem (foodItem: NewFoodItem): Promise<FoodItem> {
  return await db.insertInto('foodItem')
    .values(foodItem)
    .returningAll()
    .executeTakeFirstOrThrow()
}

export async function updateFoodItem (id: number, updateWith: FoodItemUpdate): Promise<FoodItem> {
  return await db.updateTable('foodItem')
    .set(updateWith)
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirstOrThrow()
}

export async function deleteFoodItem (id: number): Promise<void> {
  await db.deleteFrom('foodItem')
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export default {
  findFoodItemById,
  findFoodItemsByUserId,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem
}
