import { z } from 'zod'

export const zFoodItem = z.object({
  id: z.number(),
  foodName: z.string(),
  userId: z.string().uuid(),
  caloriesPerServing: z.number(),
  servingSizeInGrams: z.number(),
  searchVisibility: z.enum(['private', 'public']),
  createdAt: z.coerce.date()
})

export const zFoodItems = z.array(zFoodItem)

export const zFoodItemDetails = z.object({
  foodName: z.string(),
  userId: z.string().uuid(),
  caloriesPerServing: z.number(),
  servingSizeInGrams: z.number(),
  searchVisibility: z.enum(['private', 'public'])
})

export const zFoodItemUpdatableFields = z.object({
  foodName: z.string(),
  caloriesPerServing: z.number(),
  servingSizeInGrams: z.number(),
  searchVisibility: z.enum(['private', 'public'])
})
