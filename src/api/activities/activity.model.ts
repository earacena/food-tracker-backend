import { type Updateable, type Insertable, type Selectable, type Generated, ColumnType } from 'kysely'

export interface ActivityTable {
  id: Generated<number>
  userId: number
  mealId: number | null
  foodItemId: number | null
  createdAt: ColumnType<Date, string | undefined, never>
}

export type Activity = Selectable<ActivityTable>
export type NewActivity = Insertable<ActivityTable>
export type ActivityUpdate = Updateable<ActivityTable>
