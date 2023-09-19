import type {
  NextFunction,
  Request,
  Response
} from 'express'
import { zMealEntries, zMealEntry, zMealEntryDetails, zMealIdParams } from './mealEntry.types'
import MealEntryRepository from './mealEntry.repository'
import { zIdParams, zUserIdParams } from '../../common.types'

export async function getMealEntryByIdController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id: mealEntryId } = zIdParams.parse(req.params)
    const mealEntry = zMealEntry.parse(await MealEntryRepository.findMealEntryById(mealEntryId))

    res.status(200)
      .json({
        success: true,
        data: {
          mealEntry
        }
      })
  } catch (err: unknown) {
    next(err)
  }
}

export async function getMealEntriesByMealIdController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { mealId } = zMealIdParams.parse(req.params)
    const mealEntries = zMealEntries.parse(await MealEntryRepository.findAllMealEntriesByMealId(mealId))

    res.status(200)
      .json({
        success: true,
        data: {
          mealEntries
        }
      })
  } catch (err: unknown) {
    next(err)
  }
}

export async function getMealEntriesByUserIdController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = zUserIdParams.parse(req.params)
    const userMealEntries = zMealEntries.parse(await MealEntryRepository.findMealEntriesByUserId(userId))

    res.status(200)
      .json({
        success: true,
        data: {
          userMealEntries
        }
      })
  } catch (err: unknown) {
    next(err)
  }
}

export async function createMealEntryController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const mealEntryDetails = zMealEntryDetails.parse(req.body)
    const newMealEntry = zMealEntry.parse(await MealEntryRepository.createMealEntry(mealEntryDetails))

    res.status(201)
      .json({
        success: true,
        data: {
          newMealEntry
        }
      })
  } catch (err: unknown) {
    next(err)
  }
}
