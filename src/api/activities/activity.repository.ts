import { db } from '../../utils/db'
import { type Activity } from './activity.model'

export async function findActivitiesByUserId (userId: string): Promise<Activity[]> {
  return await db.selectFrom('activity')
    .where('userId', '=', userId)
    .selectAll()
    .execute()
}

export default {
  findActivitiesByUserId
}
