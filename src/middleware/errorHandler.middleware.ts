import type {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler
} from 'express'
import { NoResultError } from 'kysely'
import FoodItemNotFoundError from '../utils/errors/FoodItemNotFoundError'
import { ActivityNotFoundError, AuthenticationError, MealEntryNotFoundError, MealNotFoundError } from '../utils/errors'

const errorHandler: ErrorRequestHandler = (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log(err)
  if (err instanceof NoResultError) {
    res
      .status(404)
      .json({
        success: false
      })
  } else if (err instanceof FoodItemNotFoundError || err instanceof MealEntryNotFoundError || err instanceof MealNotFoundError || err instanceof ActivityNotFoundError) {
    res
      .status(404)
      .json({
        success: false,
        errorMessage: err.message
      })
  } else if (err instanceof AuthenticationError) {
    res
      .status(401)
      .json({
        success: false,
        errorMessage: err.message
      })
  } else {
    res
      .status(500)
      .json({
        success: false
      })
  }

  next()
}

export default errorHandler
