
import { FindAttributeOptions, Sequelize } from 'sequelize'
import { Event, initEvent } from '../models/event'
import { Registration } from '../models/registration'

export type EventPayload = {
	id: number,
	name: string,
  description: string,
	dateTime: Date,
  active?: boolean,
}

export type RegistrationPayload = {
	fullname: string,
  idEvent: number,
}

export const GetUpcomingEvents = async (): Promise<Event[]> => {
	await initEvent()

	const events = await Event.findAll({
    attributes: [
      'id',
      'name',
      'dateTime',
    ] as FindAttributeOptions | undefined,
    where: { dateTime: Sequelize.literal('dateTime >= NOW()'), active: 1 }
  })

  if (!events?.length) {
    console.log(`There are no events.`)
    return []
  }

  return events
}

export const GetEventById = async (idEvent: number): Promise<Event | null> => {
	await initEvent()

	const event = await Event.findOne({
    attributes: [
      'id',
      'name',
      'description',
      'dateTime',
      [ Sequelize.fn('COUNT', Sequelize.col('registrations.id')), 'attendance', ],
    ] as FindAttributeOptions | undefined,
    include: [
      {
        model: Registration,
        attributes: [],
        as: 'registrations',
      },
    ],
    where: { id: idEvent, dateTime: Sequelize.literal('dateTime >= NOW()') },
    group: ['Event.id'],
  })

  if (!event) {
    console.log(`There is no event.`)
    return null
  }

  return event
}

export const UpsertEvent = async (payload: EventPayload): Promise<Event> => {
  await initEvent()

	try {
		const existingEvent = payload.id ? await Event.findByPk(payload.id) : null
		if (existingEvent) {
			existingEvent.name = payload.name
			existingEvent.description = payload.description
			existingEvent.dateTime = payload.dateTime
			
			const updatedEvent = await existingEvent.save()

			if (!updatedEvent) throw new Error('Error updating event.')
 
			return updatedEvent
		} else {
      const newEvent = await Event.create({
        name: payload.name,
        description: payload.description,
        dateTime: payload.dateTime,
        active: true
      })
      if (!newEvent)  throw new Error('Error creating event.')

      const eventCreated = await newEvent.save()

			if (!eventCreated) throw new Error('Error creating event.')
			return eventCreated
    }
	} catch (e) {
		throw e
	}
}

export const RemoveEvent = async (id: number) => {
  await initEvent()

	try {
		const event = await Event.findByPk(id)
    if (!event) throw new Error('The event does not exist.')

    event.active = false
		await event.save()
	} catch (e) {
		throw e
	}
}

export const RegistrationUser = async (payload: RegistrationPayload): Promise<Registration> => {
	try {

		const newRegistration = await Registration.create({
      fullname: payload.fullname,
      idEvent: payload.idEvent,
      date: new Date(),
    })

    const registrationCreated = await newRegistration.save()

    if (!registrationCreated) throw new Error('Error Registrationing user in the event.')
    return registrationCreated
	} catch (e) {
		throw e
	}
}
