import { type NextFunction, type Request, type Response } from 'express'
import { zActivities, zActivity, zActivityDetails } from './activity.types'
import ActivityRepository from './activity.repository'
import { zIdParams, zUserIdParams } from '../../common.types'

export async function getActivityByIdController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = zIdParams.parse(req.params)
    const activity = zActivity.parse(await ActivityRepository.findActivityById(id))

    res.status(200)
      .json({
        success: true,
        data: {
          activity
        }
      })
  } catch (err: unknown) {
    next(err)
  }
}

export async function getActivitiesByUserIdController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = zUserIdParams.parse(req.params)
    const userActivities = zActivities.parse(await ActivityRepository.findActivitiesByUserId(userId))

    res.status(200)
      .json({
        success: true,
        data: {
          userActivities
        }
      })
  } catch (err: unknown) {
    next(err)
  }
}

export async function createActivityController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const activityDetails = zActivityDetails.parse(req.body)
    const newActivity = zActivity.parse(await ActivityRepository.createActivity(activityDetails))

    res.status(201)
      .json({
        success: true,
        data: {
          newActivity
        }
      })
  } catch (err: unknown) {
    next(err)
  }
}

export async function deleteActivityController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = zIdParams.parse(req.params)
    await ActivityRepository.deleteActivity(id)

    res.status(204)
      .json({
        success: true
      })
  } catch (err: unknown) {
    next(err)
  }
}
