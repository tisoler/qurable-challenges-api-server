import { Response, Request } from 'express'
import { EventPayload, GetUpcomingEvents, RegistrationPayload, UpsertEvent, RegistrationUser, RemoveEvent, GetEventById } from '../handlers/event'
import { sse } from './sseRouter'
import { RequestWithUser } from '../middlewares/tokenChecker'

export const RouteGetUpcomingEvents = async (req: Request, res: Response) => {
  try {
    const events = await GetUpcomingEvents()
    res.status(200).json(events)
  } catch(e) {
    console.log(e)
    res.status(400).send(e)
  }
}

export const RouteGetEventById = async (req: Request, res: Response) => {
  try {
    if (!req.params['id']) {
      res.sendStatus(400)
      return
    }
    const event = await GetEventById(parseInt(req.params['id']))

    res.status(200).json(event)
  } catch(e) {
    console.log(e)
    res.status(400).send(e)
  }
}

export const RouteUpsertEvent = async (req: RequestWithUser, res: Response) => {
  try {
    if (!req.body) {
      res.sendStatus(400)
      return
    }
    const event = await UpsertEvent(req.body as EventPayload)

    // emit put_event event to all users
    sse.send(JSON.stringify({ userId : req.user?.userId || -1 }), "put_event")

    res.status(200).json(event)
  } catch(e) {
    console.log(e)
    res.status(400).send(e)
  }
}

export const RouteRemoveEvent = async (req: RequestWithUser, res: Response) => {
  try {
    if (!req.params['id']) {
      res.sendStatus(400)
      return
    }
    await RemoveEvent(parseInt(req.params['id']))

    // emit delete_event event to all users
    sse.send(JSON.stringify({ userId : req.user?.userId || -1 }), "delete_event")

    res.status(200).json({ message: 'ok' })
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
    const registration = await RegistrationUser(req.body as RegistrationPayload)
    res.status(200).json(registration)
  } catch(e) {
    console.log(e)
    res.status(400).send(e)
  }
}
