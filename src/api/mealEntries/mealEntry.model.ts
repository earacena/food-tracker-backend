import type {
  Generated,
  Insertable,
  Selectable,
  Updateable
} from 'kysely'

export interface MealEntryTable {
  id: Generated<number>
  userId: string
  foodItemId: number
  mealId: number
  quantityInGrams: number | null
  quantityInUnits: number | null
}

export type MealEntry = Selectable<MealEntryTable>
export type NewMealEntry = Insertable<MealEntryTable>
export type MealEntryUpdate = Updateable<MealEntryTable>
