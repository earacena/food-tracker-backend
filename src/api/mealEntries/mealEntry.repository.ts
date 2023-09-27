import { db } from '../../utils/db'
import { NotFoundError } from '../../utils/errors'
import { type NewMealEntry, type MealEntry } from './mealEntry.model'
import { type MealEntries } from './mealEntry.types'

export async function findMealEntryById (id: number): Promise<MealEntry> {
  return await db.selectFrom('mealEntry')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirstOrThrow(() => new NotFoundError('mealEntry'))
}

export async function findAllMealEntriesByMealId (mealId: number): Promise<MealEntries> {
  return await db.selectFrom('mealEntry')
    .where('mealId', '=', mealId)
    .selectAll()
    .execute()
}

export async function findMealEntriesByUserId (userId: string): Promise<MealEntries> {
  return await db.selectFrom('mealEntry')
    .where('userId', '=', userId)
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

export async function deleteMealEntriesByMealId (mealId: number): Promise<void> {
  await db.deleteFrom('mealEntry')
    .where('mealId', '=', mealId)
    .returningAll()
    .execute()
}

export default {
  findMealEntryById,
  findAllMealEntriesByMealId,
  findMealEntriesByUserId,
  createMealEntry,
  deleteMealEntry,
  deleteMealEntriesByMealId
}
