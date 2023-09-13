import { type RequestHandler, Router } from 'express'
import {
  createProfileController,
  deleteProfileController,
  getProfileByUserIdController,
  updateProfileController
} from './profile.controllers'

const profileRouter = Router()

profileRouter.get('/:userId', getProfileByUserIdController as RequestHandler)
profileRouter.post('/', createProfileController as RequestHandler)
profileRouter.put('/:userId', updateProfileController as RequestHandler)
profileRouter.delete('/:userId', deleteProfileController as RequestHandler)

export default profileRouter
