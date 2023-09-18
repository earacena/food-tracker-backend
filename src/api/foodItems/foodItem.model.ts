import type {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable
} from 'kysely'

export interface FoodItemTable {
  id: Generated<number>
  foodName: string
  userId: string
  caloriesPerServing: number
  servingSizeInGrams: number
  searchVisibility: 'public' | 'private'
  createdAt: ColumnType<Date, string | undefined, never>
};

export type FoodItem = Selectable<FoodItemTable>
export type NewFoodItem = Insertable<FoodItemTable>
export type FoodItemUpdate = Updateable<FoodItemTable>
