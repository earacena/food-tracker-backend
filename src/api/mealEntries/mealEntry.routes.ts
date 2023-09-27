import { type RequestHandler, Router } from 'express'
import { createMealEntryController, deleteMealEntriesByMealIdController, deleteMealEntryController, getMealEntriesByMealIdController, getMealEntriesByUserIdController, getMealEntryByIdController } from './mealEntry.controllers'

const mealEntryRouter = Router()

mealEntryRouter.get('/:id', getMealEntryByIdController as RequestHandler)
mealEntryRouter.get('/meal/:mealId', getMealEntriesByMealIdController as RequestHandler)
mealEntryRouter.get('/user/:userId', getMealEntriesByUserIdController as RequestHandler)
mealEntryRouter.post('/', createMealEntryController as RequestHandler)
mealEntryRouter.delete('/:id', deleteMealEntryController as RequestHandler)
mealEntryRouter.delete('/meal/:mealId', deleteMealEntriesByMealIdController as RequestHandler)

export default mealEntryRouter
