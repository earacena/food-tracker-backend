import { db } from "../../utils/db";
import { Activity } from "./activity.model";

export async function findActivitiesByUserId (userId: number): Promise<Activity[]> {
  return await db.selectFrom('activity')
    .where('userId', '=', userId)
    .selectAll()
    .execute()
}

export default {
  findActivitiesByUserId
}
