import type {
  ColumnType,
  Selectable,
  Insertable,
  Updateable,
  Generated
} from 'kysely'

export interface MealTable {
  id: Generated<number>
  userId: number
  name: string
  createdAt: ColumnType<Date, string | undefined, never>
};

export type Meal = Selectable<MealTable>
export type NewMeal = Insertable<MealTable>
export type MealUpdate = Updateable<MealTable>
