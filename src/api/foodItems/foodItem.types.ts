import { z } from 'zod'

export const zIdParams = z.object({
  id: z.coerce.number()
})

export const zUserIdParams = z.object({
  userId: z.coerce.number()
})

export const zFoodItemDetails = z.object({
  foodName: z.string(),
  userId: z.number(),
  caloriesPerServing: z.number(),
  servingSizeInGrams: z.number().nullable(),
  servingSizeInUnits: z.number().nullable(),
  searchVisibility: z.enum(['private', 'public'])
})

export const zFoodItemUpdatableFields = z.object({
  foodName: z.string(),
  caloriesPerServing: z.number(),
  servingSizeInGrams: z.number().nullable(),
  servingSizeInUnits: z.number().nullable(),
  searchVisibility: z.enum(['private', 'public'])
})
