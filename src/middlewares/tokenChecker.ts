import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { UserData } from '../handlers/user'

export type RequestWithUser = Request & { user?: UserData }

const verifyToken = (req: RequestWithUser, res: Response, next: NextFunction) => {
  const token = req.header('auth-token')
  if (!token) return res.status(401).json({ error: 'Access denied' })

  try {
    const verificado = jwt.verify(token, process.env.SECRET_TOKEN || '')
    req.user = verificado as UserData
    next()
  } catch (error) {
    return res.status(400).json({error: 'token is not valid'})
  }
}

export default verifyToken
