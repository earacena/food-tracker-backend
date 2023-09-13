import type { NextFunction, Request, Response } from 'express'
import ProfileRepository from './profile.repository'
import { zProfile, zProfileDetails, zProfileUpdatableFields } from './profile.types'
import { zUserIdParams } from '../../common.types'

export async function getProfileByUserIdController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = zUserIdParams.parse(req.params)
    const profile = zProfile.parse(await ProfileRepository.findProfileByUserId(userId))

    res.status(200)
      .json({
        success: true,
        data: {
          userProfile: profile
        }
      })
  } catch (err: unknown) {
    next(err)
  }
}

export async function createProfileController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const profileDetails = zProfileDetails.parse(req.body)
    const newProfile = zProfile.parse(await ProfileRepository.createProfile(profileDetails))

    res.status(201)
      .json({
        success: true,
        data: {
          newProfile
        }
      })
  } catch (err: unknown) {
    next(err)
  }
}

export async function updateProfileController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = zUserIdParams.parse(req.params)
    const profileFields = zProfileUpdatableFields.parse(req.body)

    const updatedProfile = zProfile.parse(await ProfileRepository.updateProfile(userId, profileFields))

    res.status(200)
      .json({
        success: true,
        data: {
          updatedProfile
        }
      })
  } catch (err: unknown) {
    next(err)
  }
}

export async function deleteProfileController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = zUserIdParams.parse(req.params)

    await ProfileRepository.deleteProfile(userId)

    res.status(204)
      .json({
        success: true
      })
  } catch (err: unknown) {
    next(err)
  }
}
