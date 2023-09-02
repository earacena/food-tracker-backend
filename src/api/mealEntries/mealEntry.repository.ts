import { db } from '../../utils/db'
import { type MealEntry } from './mealEntry.model'

export async function findAllMealEntriesByMealId (mealId: number): Promise<MealEntry[]> {
  return await db.selectFrom('mealEntry')
    .where('mealId', '=', mealId)
    .selectAll()
    .execute()
}

export default {
  findAllMealEntriesByMealId
}
