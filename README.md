
## Getting Started

First, install all dependencies:

```bash
yarn install
```

Then, run the development server locally:

```bash
npm run start:dev
# or
yarn start:dev
# or
pnpm start:dev
```

Open [http://localhost:3033](http://localhost:3033) with your browser to see the result (e.g. http://localhost:3033/event/upcoming).

## Other scripts:

You can run this one to generate the files to be deployed. Files will be placed in the folder ```dist```
``` bash
yarn build
or
yarn buildWin
```

You can run the app from the built files runnig:
``` bash
yarn start
```

You can also run the app with nodemon (that automatically reflects changes) from the built files runnig:
``` bash
yarn dev
```

This project includes EsLint so you can check for lint errors or warnings running:
``` bash
yarn lint
```
To fix the lint issues automatically please run:
``` bash
yarn format
```

Handler methods include some unit tests to ensure their logic. Tests are implemented with mocha, chai and sinon.
To run all tests you have to execute:
``` bash
yarn test
```

## Environment variables:

You have to include a file called ```.env``` that contains the env variables.
You can take the file content from ```.env.example```, the keys ```API_PORT, FRONTEND_URL, DATA_BASE_HOST, DATA_BASE_PORT, DATA_BASE_USER, DATA_BASE_PASSWORD, DATA_BASE, SECRET_TOKEN``` are required. SECRET_TOKEN is used to generate JWT tokens.

## Data base connection and modeling

This API stores and retrieves data from a mysql database. Connection data should be included in the .env file.
Data model in the server side represented and handled with ```sequelize``` ORM library.

## Exercise 5 - real-time updates

Regarding to the requirement: Implement some form of real-time updates (e.g., users see new events as soon as they're created without having to refresh the page).

The selected approach is Server-sent events. Since we need to send messages from the server to clients, a unidirectional channel is enough to reach the goal (instead of a web socket for example).
The sse router is defined in ```src\routes\sseRouter.ts```. Server sends event messages to clients when an event is created or updated (RouteUpsertEvent method), also when an event is removed (RouteRemoveEvent), both in ```src\routes\event.ts```.
