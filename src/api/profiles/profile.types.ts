import { z } from 'zod'

export const zProfile = z.object({
  userId: z.string(),
  name: z.string(),
  dailyCalorieGoal: z.number(),
  createdAt: z.coerce.date()
})

export const zProfiles = z.array(zProfile)

export const zProfileDetails = z.object({
  userId: z.string(),
  name: z.string(),
  dailyCalorieGoal: z.number()
})

export const zProfileUpdatableFields = z.object({
  dailyCalorieGoal: z.number()
})
