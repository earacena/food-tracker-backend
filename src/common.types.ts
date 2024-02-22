import { z } from 'zod'

export const zIdParams = z.object({
  id: z.coerce.number()
})

export const zUserIdParams = z.object({
  userId: z.string()
})
