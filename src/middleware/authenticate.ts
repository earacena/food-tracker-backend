import { type NextFunction, type Request, type Response } from 'express'
import { KEYCLOAK_PUBLIC_KEY } from '../config'
import Jwt, { TokenExpiredError } from 'jsonwebtoken'
import AuthenticationError from '../utils/errors/AuthenticationError'
import { z } from 'zod'

function extractJwt (req: Request): string | null {
  const bearerResult = z.string().safeParse(req.headers['authentication'])
  if (!bearerResult.success) {
    return null
  }
  const bearer = bearerResult.data
  const token = bearer.split(' ')[1]

  return token ?? null
}

function decodeJwt (token: string): string | Jwt.JwtPayload {
  const decodedToken = Jwt.verify(token, KEYCLOAK_PUBLIC_KEY, {
    algorithms: ['RS256']
  })

  return decodedToken
}

function authenticate (req: Request, _res: Response, next: NextFunction): void {
  try {
    const token = extractJwt(req)
    if (token != null) {
      const decodedToken = decodeJwt(token)
      req.body.token = decodedToken
      next()
    }
  } catch (err: unknown) {
    if (err instanceof TokenExpiredError) {
      next(new AuthenticationError('jwt expired'))
      return
    }

    next(new AuthenticationError('must be authenticated to do this'))
  }
}

export default authenticate
