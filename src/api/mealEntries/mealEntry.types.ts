import { z } from 'zod'

export const zMealEntry = z.object({
  id: z.number(),
  userId: z.string().uuid(),
  foodItemId: z.number(),
  mealId: z.number(),
  quantityInGrams: z.number().nullable(),
  quantityInUnits: z.number().nullable()
})

export const zMealEntries = z.array(zMealEntry)

export type MealEntry = z.infer<typeof zMealEntry>
export type MealEntries = z.infer<typeof zMealEntries>

export const zMealIdParams = z.object({
  mealId: z.coerce.number()
})

export const zMealEntryDetails = z.object({
  userId: z.string().uuid(),
  foodItemId: z.number(),
  mealId: z.number(),
  quantityInGrams: z.number().nullable(),
  quantityInUnits: z.number().nullable()
})
