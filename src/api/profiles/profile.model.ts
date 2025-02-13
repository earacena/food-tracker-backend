import type { Insertable, ColumnType, Selectable, Updateable } from 'kysely'

export interface ProfileTable {
  userId: string
  name: string
  dailyCalorieGoal: number
  createdAt: ColumnType<Date, string | undefined, never>
}

export type Profile = Selectable<ProfileTable>
export type NewProfile = Insertable<ProfileTable>
export type ProfileUpdate = Updateable<ProfileTable>
