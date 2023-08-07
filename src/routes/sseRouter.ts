import express, { Router } from 'express'
import SSE from 'express-sse-ts'

export const sse = new SSE()

const sseRouter: Router = express.Router()

sseRouter.get("/stream", sse.init)

export default sseRouter
