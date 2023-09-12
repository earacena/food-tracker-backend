import type { Updateable, Insertable, Selectable, Generated, ColumnType } from 'kysely'

export interface ActivityTable {
  id: Generated<number>
  userId: string
  mealId: number | null
  foodItemId: number | null
  quantity: number
  createdAt: ColumnType<Date, string | undefined, never>
}

export type Activity = Selectable<ActivityTable>
export type NewActivity = Insertable<ActivityTable>
export type ActivityUpdate = Updateable<ActivityTable>
