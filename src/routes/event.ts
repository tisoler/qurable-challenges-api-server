import { Request, Response } from 'express'
import { EventPayload, GetUpcomingEvents, RegistrationPayload, UpsertEvent, RegistrationUser } from '../handlers/event'

export const RouteGetUpcomingEvents = async (req: Request, res: Response) => {
  try {
    const events = await GetUpcomingEvents()
    res.status(200).json(events)
  } catch(e) {
    console.log(e)
    res.status(400).send(e)
  }
}


export const RouteUpsertEvent = async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      res.sendStatus(400)
      return
    }
    const subscriptions = await UpsertEvent(req.body as EventPayload)
    res.status(200).json(subscriptions)
  } catch(e) {
    console.log(e)
    res.status(400).send(e)
  }
}

export const RouteRegistrationUser = async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      res.sendStatus(400)
      return
    }
    const subscriptions = await RegistrationUser(req.body as RegistrationPayload)
    res.status(200).json(subscriptions)
  } catch(e) {
    console.log(e)
    res.status(400).send(e)
  }
}
