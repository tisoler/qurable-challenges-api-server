
import express, { Router } from 'express'
import { RouteGetUpcomingEvents, RouteRegistrationUser, RouteUpsertEvent } from './event'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'

export const apiRouter: Router = express.Router()

// --- Swagger ---//
// Dynamic Swagger documentation
const options = {
	definition: {
	  openapi: '3.0.0',
	  info: {
			title: 'Subscriptions API',
			version: '1.0.0',
			license: {
				name: "MIT"
			}
	  },
	},
	apis: ['./src/routes/index.ts', './routes/index.js'],
}

const openapiSpecification = swaggerJsdoc(options)

apiRouter.use('/api-docs', swaggerUi.serve);
apiRouter.get('/api-docs', swaggerUi.setup(openapiSpecification))

// --- Routes --- //

/**
 * @openapi
 * /event/upcoming:
 *    get:
 *     description: List of upcoming events
 *     tags:
 *       - events
 *     responses:
 *       200:
 *         description: Retrieves a list of upcoming events.
*/

apiRouter.get('/event/upcoming', RouteGetUpcomingEvents)


/**
 * @openapi
 * /event:
 *    put:
 *     description: Insert or update event
 *     tags:
 *       - events
 *     requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: integer
 *              name:
 *                type: string
 *              description:
 *                type: string
 *              dateTime:
 *                type: date
 *            required:
 *              - name
 *              - description
 *    responses:
 *      200:
 *        description: Created or updated event.
*/

apiRouter.put('/event', RouteUpsertEvent)


/**
 * @openapi
 * /event/Registration:
 *    post:
 *     description: Registration a user in an event
 *     tags:
 *       - events
 *     requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              idUser:
 *                type: number
 *              idEvent:
 *                type: number
 *            required:
 *              - idUser
 *              - idEvent
 *    responses:
 *      200:
 *        description: Registration of the user in the event.
*/

apiRouter.post('/event/Registration', RouteRegistrationUser)
