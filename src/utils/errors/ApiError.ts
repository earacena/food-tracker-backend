import { type Response } from 'express'

class ApiError extends Error {
  respond (res: Response): Response {
    return res
      .status(500)
      .json({
        success: false,
        errorMessage: 'internal server error'
      })
  }
}

export default ApiError
