import { type NextFunction, type Request, type Response } from 'express'
import { TokenExpiredError } from 'jsonwebtoken'
import AuthenticationError from '../utils/errors/AuthenticationError'
import { z } from 'zod'
import { type DecodedIdToken, getAuth } from 'firebase-admin/auth'

function extractJwt (req: Request): string | null {
  const bearerResult = z.string().safeParse(req.headers['authentication'])
  if (!bearerResult.success) {
    return null
  }
  const bearer = bearerResult.data
  const token = bearer.split(' ')[1]

  return token ?? null
}

async function decodeJwt (token: string): Promise<DecodedIdToken> {
  // Decode token using firebase SDK
  const decoded = await getAuth().verifyIdToken(token)
  return decoded
}

async function authenticate (req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const token = extractJwt(req)
    if (token != null) {
      const decodedToken = await decodeJwt(token)

      req.body.token = decodedToken
      next()
    }
  } catch (err: unknown) {
    if (err instanceof TokenExpiredError) {
      next(new AuthenticationError('jwt expired'))
      return
    }

    next(new AuthenticationError('must be authenticated to do this / unable to verify token'))
  }
}

export default authenticate
