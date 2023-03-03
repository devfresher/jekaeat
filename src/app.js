import express from 'express'
import bootstrap from './startup/bootstrap.js'
const app = express()

bootstrap(app)
export default app