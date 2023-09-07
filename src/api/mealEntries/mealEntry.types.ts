import { z } from 'zod'

export const zMealEntry = z.object({
  id: z.number(),
  userId: z.number(),
  foodItemId: z.number().nullable(),
  mealId: z.number().nullable()
})

export const zMealEntries = z.array(zMealEntry)

export const zMealIdParams = z.object({
  mealId: z.coerce.number()
})

export const zMealEntryDetails = z.object({
  userId: z.number(),
  foodItemId: z.number().nullable(),
  mealId: z.number().nullable()
})
