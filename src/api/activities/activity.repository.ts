import { db } from '../../utils/db'
import { NotFoundError } from '../../utils/errors'
import { type NewActivity, type Activity } from './activity.model'

export async function findActivityById (id: number): Promise<Activity> {
  return await db.selectFrom('activity')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirstOrThrow(() => new NotFoundError('activity'))
}

export async function findActivitiesByUserId (userId: string): Promise<Activity[]> {
  return await db.selectFrom('activity')
    .where('userId', '=', userId)
    .selectAll()
    .execute()
}

export async function findActivitiesByMealId (mealId: number): Promise<Activity[]> {
  return await db.selectFrom('activity')
    .where('mealId', '=', mealId)
    .selectAll()
    .execute()
}

export async function createActivity (activity: NewActivity): Promise<Activity> {
  return await db.insertInto('activity')
    .values(activity)
    .returningAll()
    .executeTakeFirstOrThrow()
}

export async function deleteActivitiesByMealId (mealId: number): Promise<void> {
  await db.deleteFrom('activity')
    .where('mealId', '=', mealId)
    .execute()
}

export async function deleteActivity (id: number): Promise<void> {
  await db.deleteFrom('activity')
    .where('id', '=', id)
    .execute()
}

export default {
  findActivityById,
  findActivitiesByUserId,
  findActivitiesByMealId,
  createActivity,
  deleteActivity,
  deleteActivitiesByMealId
}
