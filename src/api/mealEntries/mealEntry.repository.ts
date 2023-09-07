import { db } from '../../utils/db'
import { MealEntryNotFoundError } from '../../utils/errors'
import { type NewMealEntry, type MealEntry } from './mealEntry.model'

export async function findMealEntryById (id: number): Promise<MealEntry> {
  return await db.selectFrom('mealEntry')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirstOrThrow(() => new MealEntryNotFoundError('mealEntry not found'))
}

export async function findAllMealEntriesByMealId (mealId: number): Promise<MealEntry[]> {
  return await db.selectFrom('mealEntry')
    .where('mealId', '=', mealId)
    .selectAll()
    .execute()
}

export async function createMealEntry (mealEntry: NewMealEntry): Promise<MealEntry> {
  return await db.insertInto('mealEntry')
    .values(mealEntry)
    .returningAll()
    .executeTakeFirstOrThrow()
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
  createMealEntry,
  deleteMealEntry
}
