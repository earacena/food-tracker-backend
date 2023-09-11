import { db } from '../../utils/db'
import { ProfileNotFoundError } from '../../utils/errors'
import { type ProfileUpdate, type NewProfile, type Profile } from './profile.model'

export async function findProfileByUserId (userId: string): Promise<Profile> {
  return await db.selectFrom('profile')
    .where('userId', '=', userId)
    .selectAll()
    .executeTakeFirstOrThrow(() => new ProfileNotFoundError('profile not found'))
}

export async function createProfile (profile: NewProfile): Promise<Profile> {
  return await db.insertInto('profile')
    .values(profile)
    .returningAll()
    .executeTakeFirstOrThrow()
}

export async function updateProfile (userId: string, updateWith: ProfileUpdate): Promise<Profile> {
  return await db.updateTable('profile')
    .set(updateWith)
    .where('userId', '=', userId)
    .returningAll()
    .executeTakeFirstOrThrow()
}

export async function deleteProfile (userId: string): Promise<void> {
  await db.deleteFrom('profile')
    .where('userId', '=', userId)
    .returningAll()
    .executeTakeFirst()
}

export default {
  findProfileByUserId,
  createProfile,
  updateProfile,
  deleteProfile
}
