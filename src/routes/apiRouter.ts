
import express, { Router } from 'express'
import { RouteGetEventById, RouteGetUpcomingEvents, RouteRegistrationUser, RouteRemoveEvent, RouteUpsertEvent } from './event'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import { RouteAuthenticate } from './users'
import verifyToken from '../middlewares/tokenChecker'

const apiRouter: Router = express.Router()

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
	apis: ['./src/routes/apiRouter.ts', './routes/apiRouter.js'],
}

const openapiSpecification = swaggerJsdoc(options)

apiRouter.use('/docs', swaggerUi.serve);
apiRouter.get('/docs', swaggerUi.setup(openapiSpecification))

// --- Routes --- //

/**
 * @openapi
 * api/event/upcoming:
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
 * api/event:
 *    get:
 *     description: get event by id
 *     tags:
 *       - events
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the event to remove
 *     responses:
 *       200:
 *         description: Retrieves an event.
*/

apiRouter.get('/event/:id', RouteGetEventById)


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

apiRouter.put('/event', verifyToken, RouteUpsertEvent)


/**
 * @openapi
 * /event:
 *    delete:
 *      description: Remove an event by id
 *      tags:
 *       - events
 *      parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the event to remove
 *    responses:
 *      200:
 *        description: OK status.
*/

apiRouter.delete('/event/:id', verifyToken, RouteRemoveEvent)


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

apiRouter.post('/event/register', RouteRegistrationUser)


/**
 * @openapi
 * /authenticate:
 *    post:
 *     description: Authenticate user
 *     tags:
 *       - users
 *     requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              password:
 *                type: string
 *            required:
 *              - username
 *              - password
 *    responses:
 *      200:
 *        description: User token.
*/

apiRouter.post('/authenticate', RouteAuthenticate)

export default apiRouter
