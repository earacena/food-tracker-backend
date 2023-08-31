import { type RequestHandler, Router } from 'express'
import {
  getMealByIdController,
  getMealsByUserIdController,
  createMealController,
  updateMealController,
  deleteMealController
} from './meal.controllers'

const mealRouter = Router()

mealRouter.get('/:id', getMealByIdController as RequestHandler)
mealRouter.get('/user/:userId', getMealsByUserIdController as RequestHandler)
mealRouter.post('/', createMealController as RequestHandler)
mealRouter.put('/:id', updateMealController as RequestHandler)
mealRouter.delete('/:id', deleteMealController as RequestHandler)

export default mealRouter
