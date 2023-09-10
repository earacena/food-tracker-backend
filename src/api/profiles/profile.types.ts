import { z } from 'zod'

export const zProfile = z.object({
  userId: z.string().uuid(),
  dailyCalorieGoal: z.number().nullable(),
  createdAt: z.coerce.date()
})

export const zProfiles = z.array(zProfile)
