
import { FindAttributeOptions, Sequelize } from 'sequelize'
import { Event, initEvent } from '../models/event'
import { Registration } from '../models/registration'
import { User } from '../models/user'

export type EventPayload = {
	id: number,
	name: string,
  description: string,
	dateTime: Date,
}

export type RegistrationPayload = {
	idUser: number,
  idEvent: number,
}

export const GetUpcomingEvents = async (): Promise<Event[]> => {
	await initEvent()

	const events = await Event.findAll({
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
    group: ['Event.id'],
  })

  if (!events?.length) {
    console.log(`There are no events.`)
    return []
  }

  return events
}

export const UpsertEvent = async (payload: EventPayload): Promise<Event> => {
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

export const RegistrationUser = async (payload: RegistrationPayload): Promise<Registration> => {
	try {
		const user = await User.findByPk(payload.idUser)
		const event = await Event.findByPk(payload.idEvent)
    if (!user || !event) throw new Error('User or event do not exist.')

		const existingRegistration = await Registration.findOne({
      where: { idUser: payload.idUser, idEvent: payload.idEvent }
    })
    if (existingRegistration) throw new Error('User is already Registrationed for this event.')

		const newRegistration = await Registration.create({
      idUser: payload.idUser,
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
