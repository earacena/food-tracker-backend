import { type Response } from 'express'

class NotFoundError extends Error {
  resourceName

  constructor (resourceName: string) {
    super()
    this.resourceName = resourceName
  }

  respond (res: Response): Response {
    return res
      .status(404)
      .json({
        success: false,
        errorMessage: `${this.resourceName} not found`
      })
  }
}

export default NotFoundError
