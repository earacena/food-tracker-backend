import { db } from '../../utils/db'
import { MealNotFoundError } from '../../utils/errors'
import { type NewMeal, type Meal, type MealUpdate } from './meal.model'

export async function findMealById (id: number): Promise<Meal> {
  return await db.selectFrom('meal')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirstOrThrow(() => new MealNotFoundError('meal not found'))
}

export async function findMealsByUserId (userId: string): Promise<Meal[]> {
  return await db.selectFrom('meal')
    .where('userId', '=', userId)
    .selectAll()
    .execute()
}

export async function createMeal (meal: NewMeal): Promise<Meal> {
  return await db.insertInto('meal')
    .values(meal)
    .returningAll()
    .executeTakeFirstOrThrow()
}

export async function updateMeal (id: number, updateWith: MealUpdate): Promise<Meal> {
  return await db.updateTable('meal')
    .set(updateWith)
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirstOrThrow()
}

export async function deleteMeal (id: number): Promise<void> {
  await db.deleteFrom('meal')
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export default {
  findMealById,
  findMealsByUserId,
  createMeal,
  updateMeal,
  deleteMeal
}
