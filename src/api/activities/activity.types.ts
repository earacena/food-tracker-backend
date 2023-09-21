import { z } from 'zod'

export const zActivity = z.object({
  id: z.number(),
  userId: z.string().uuid(),
  foodItemId: z.number().nullable(),
  mealId: z.number().nullable(),
  quantityInGrams: z.number().nullable(),
  quantityInUnits: z.number().nullable(),
  createdAt: z.coerce.date()
})

export const zActivities = z.array(zActivity)

export const zActivityDetails = z.object({
  userId: z.string().uuid(),
  foodItemId: z.number().nullable(),
  mealId: z.number().nullable(),
  quantityInGrams: z.number().nullable(),
  quantityInUnits: z.number().nullable()
})
