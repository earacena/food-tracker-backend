import type {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler
} from 'express'
import { AuthenticationError } from '../utils/errors'
import NotFoundError from '../utils/errors/NotFoundError'

const errorHandler: ErrorRequestHandler = (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof NotFoundError) {
    res = err.respond(res)
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
        success: false,
        errorMessage: 'internal server error'
      })
  }

  next()
}

export default errorHandler
