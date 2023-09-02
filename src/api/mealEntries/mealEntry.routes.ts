import { type RequestHandler, Router } from 'express'
import { getMealEntriesByMealIdController } from './mealEntry.controllers'

const mealEntryRouter = Router()

mealEntryRouter.get('/meal/:mealId', getMealEntriesByMealIdController as RequestHandler)

export default mealEntryRouter
