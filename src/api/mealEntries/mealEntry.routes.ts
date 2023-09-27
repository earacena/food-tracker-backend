import { type RequestHandler, Router } from 'express'
import { createMealEntryController, deleteMealEntryController, getMealEntriesByMealIdController, getMealEntriesByUserIdController, getMealEntryByIdController } from './mealEntry.controllers'

const mealEntryRouter = Router()

mealEntryRouter.get('/:id', getMealEntryByIdController as RequestHandler)
mealEntryRouter.get('/meal/:mealId', getMealEntriesByMealIdController as RequestHandler)
mealEntryRouter.get('/user/:userId', getMealEntriesByUserIdController as RequestHandler)
mealEntryRouter.post('/', createMealEntryController as RequestHandler)
mealEntryRouter.delete('/:id', deleteMealEntryController as RequestHandler)

export default mealEntryRouter
