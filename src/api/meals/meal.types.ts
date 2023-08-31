import { z } from 'zod'

export const zMeal = z.object({
  id: z.number(),
  userId: z.number(),
  name: z.string(),
  createdAt: z.coerce.date()
})

export const zMeals = z.array(zMeal)

export const zMealDetails = z.object({
  userId: z.number(),
  name: z.string()
})

export const zMealUpdatableFields = z.object({
  name: z.string()
})
