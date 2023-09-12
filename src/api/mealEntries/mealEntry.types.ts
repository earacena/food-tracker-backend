import { z } from 'zod'

export const zMealEntry = z.object({
  id: z.number(),
  userId: z.string().uuid(),
  foodItemId: z.number(),
  mealId: z.number()
})

export const zMealEntries = z.array(zMealEntry)

export const zMealIdParams = z.object({
  mealId: z.coerce.number()
})

export const zMealEntryDetails = z.object({
  userId: z.string().uuid(),
  foodItemId: z.number(),
  mealId: z.number()
})
