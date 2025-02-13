import { z } from 'zod'

export const zFoodItem = z.object({
  id: z.number(),
  foodName: z.string(),
  userId: z.string(),
  caloriesPerServing: z.number(),
  servingSizeInGrams: z.number().nullable(),
  servingSizeInUnits: z.number().nullable(),
  searchVisibility: z.enum(['private', 'public']),
  createdAt: z.coerce.date()
})

export const zFoodItems = z.array(zFoodItem)

export const zFoodItemDetails = z.object({
  foodName: z.string(),
  userId: z.string(),
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
