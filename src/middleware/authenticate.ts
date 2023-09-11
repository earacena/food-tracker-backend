import { type NextFunction, type Request, type Response } from 'express'
import { KEYCLOAK_PUBLIC_KEY } from '../config'
import Jwt from 'jsonwebtoken'
import AuthenticationError from '../utils/errors/AuthenticationError'

function extractJwt (req: Request): string | undefined {
  const bearer = req.headers.authorization
  const token = bearer?.split(' ')[1]
  return token
}

function decodeJwt (token: string): string | Jwt.JwtPayload {
  const decodedToken = Jwt.verify(token, KEYCLOAK_PUBLIC_KEY, {
    algorithms: ['RS256']
  })

  return decodedToken
}

function authenticate (req: Request, _res: Response, next: NextFunction): void {
  const token = extractJwt(req)
  if (token !== undefined) {
    const decodedToken = decodeJwt(token)

    req.body.token = decodedToken

    next()
  }

  next(new AuthenticationError('must be authenticated to do this'))
}

export default authenticate
