import { Request, Response } from 'express'
import { Authenticate, AuthenticatePayload } from '../handlers/user'

export const RouteAuthenticate = async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      res.sendStatus(400)
      return
    }

    const token = await Authenticate(req.body as AuthenticatePayload)
    res.status(200).json(token)
  } catch(e) {
    console.log(e)
    res.status(400).send(e)
  }
}
