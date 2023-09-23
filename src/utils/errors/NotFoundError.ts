import { type Response } from 'express'
import ApiError from './ApiError'

class NotFoundError extends ApiError {
  resourceName

  constructor (resourceName: string) {
    super()
    this.resourceName = resourceName
  }

  override respond (res: Response): Response {
    return res
      .status(404)
      .json({
        success: false,
        errorMessage: `${this.resourceName} not found`
      })
  }
}

export default NotFoundError
