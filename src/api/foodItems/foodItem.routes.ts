import { type RequestHandler, Router } from 'express'
import {
  getFoodItemController,
  getFoodItemsOfUserController,
  createFoodItemController,
  updateFoodItemController,
  deleteFoodItemController
} from './foodItem.controllers'

const foodItemRouter = Router()

foodItemRouter.get('/:id', getFoodItemController as RequestHandler)
foodItemRouter.get('/user/:userId', getFoodItemsOfUserController as RequestHandler)
foodItemRouter.post('/', createFoodItemController as RequestHandler)
foodItemRouter.put('/:id', updateFoodItemController as RequestHandler)
foodItemRouter.delete('/:id', deleteFoodItemController as RequestHandler)

export default foodItemRouter
