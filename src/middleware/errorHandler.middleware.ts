import type {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler
} from 'express'

const errorHandler: ErrorRequestHandler = (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  res = err.respond(res)
  next()
}

export default errorHandler
