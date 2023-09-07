import { type RequestHandler, Router } from 'express'
import { createMealEntryController, getMealEntriesByMealIdController, getMealEntryByIdController } from './mealEntry.controllers'

const mealEntryRouter = Router()

mealEntryRouter.get('/:id', getMealEntryByIdController as RequestHandler)
mealEntryRouter.get('/meal/:mealId', getMealEntriesByMealIdController as RequestHandler)
mealEntryRouter.post('/', createMealEntryController as RequestHandler)

export default mealEntryRouter
