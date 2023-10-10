import { type RequestHandler, Router } from 'express'
import {
  createActivityController,
  deleteActivitiesByMealIdController,
  deleteActivityController,
  getActivitiesByUserIdController,
  getActivityByIdController
} from './activity.controllers'

const activityRouter = Router()

activityRouter.get('/:id', getActivityByIdController as RequestHandler)
activityRouter.get(
  '/user/:userId',
  getActivitiesByUserIdController as RequestHandler
)
activityRouter.post('/', createActivityController as RequestHandler)
activityRouter.delete('/:id', deleteActivityController as RequestHandler)
activityRouter.delete(
  '/meal/:mealId',
  deleteActivitiesByMealIdController as RequestHandler
)

export default activityRouter
