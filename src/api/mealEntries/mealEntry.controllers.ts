import type {
  NextFunction,
  Request,
  Response
} from 'express'
import { zMealEntries, zMealIdParams } from './mealEntry.types'
import MealEntryRepository from './mealEntry.repository'

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
