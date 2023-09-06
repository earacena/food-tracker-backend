import { db } from '../../utils/db'
import { type MealEntry } from './mealEntry.model'

export async function findMealEntryById (id: number): Promise<MealEntry> {
  return await db.selectFrom('mealEntry')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirstOrThrow()
}

export async function findAllMealEntriesByMealId (mealId: number): Promise<MealEntry[]> {
  return await db.selectFrom('mealEntry')
    .where('mealId', '=', mealId)
    .selectAll()
    .execute()
}

export async function deleteMealEntry (id: number): Promise<void> {
  await db.deleteFrom('mealEntry')
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export default {
  findAllMealEntriesByMealId,
  findMealEntryById,
  deleteMealEntry
}
