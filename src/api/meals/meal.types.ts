import { z } from 'zod'

export const zMeal = z.object({
  id: z.number(),
  userId: z.string(),
  name: z.string(),
  createdAt: z.coerce.date()
})

export const zMeals = z.array(zMeal)

export const zMealDetails = z.object({
  userId: z.string(),
  name: z.string()
})

export const zMealUpdatableFields = z.object({
  name: z.string()
})
