import { z } from 'zod'

export const zMeal = z.object({
  id: z.number(),
  userId: z.number(),
  name: z.string(),
  createdAt: z.coerce.date()
})

export const zMeals = z.array(zMeal)
