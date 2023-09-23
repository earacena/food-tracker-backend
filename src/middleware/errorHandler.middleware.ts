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
  if ('respond' in err) {
    res = err.respond(res)
  } else {
    res = new ApiError(err.message).respond(res)
  }
  next()
}

export default errorHandler
