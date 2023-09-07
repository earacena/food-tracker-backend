import type {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction
} from 'express'
import { NoResultError } from 'kysely'
import FoodItemNotFoundError from '../utils/errors/FoodItemNotFoundError'

const errorHandler: ErrorRequestHandler = (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof NoResultError) {
    res
      .status(404)
      .json({
        success: false
      })
  } else if (err instanceof FoodItemNotFoundError) {
    res
      .status(404)
      .json({
        success: false,
        errorMessage: 'foodItem not found'
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
