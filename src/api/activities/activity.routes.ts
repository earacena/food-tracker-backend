import { type RequestHandler, Router } from 'express'
import { createActivityController, deleteActivityController, getActivitiesByUserIdController, getActivityByIdController } from './activity.controllers'

const activityRouter = Router()

activityRouter.get('/:id', getActivityByIdController as RequestHandler)
activityRouter.get('/user/:userId', getActivitiesByUserIdController as RequestHandler)
activityRouter.post('/', createActivityController as RequestHandler)
activityRouter.delete('/:id', deleteActivityController as RequestHandler)

export default activityRouter
