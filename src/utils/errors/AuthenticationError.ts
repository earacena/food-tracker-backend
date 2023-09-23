import { type Response } from 'express'
import ApiError from './ApiError'

class AuthenticationError extends ApiError {
  override respond (res: Response): Response {
    return res
      .status(401)
      .json({
        success: false,
        errorMessage: this.message
      })
  }
}

export default AuthenticationError
