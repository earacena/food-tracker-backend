import type {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler
} from 'express'
import { ApiError } from '../utils/errors'

const errorHandler: ErrorRequestHandler = (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof ApiError) {
    res = err.respond(res)
  } else {
    console.error(err)

    res
      .status(500)
      .json({
        success: false,
        errorMessage: 'internal server error'
      })
  }

  next()
}

export default errorHandler
