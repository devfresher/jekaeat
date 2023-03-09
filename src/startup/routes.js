import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'

import authRouter from '../routes/auth.js'
import mealRouter from '../routes/meal.js'
import orderRouter from '../routes/order.js'
import userRouter from '../routes/user.js'
import webhookRouter from '../routes/webhook.js'


import ResponseMiddleware from '../middleware/response.js'


const routeApp = function (app) {
    app.use(bodyParser.json())
    app.use(cors())
    app.use(helmet())

    app.use('/api/auth', authRouter)
    app.use('/api/meals', mealRouter)
    app.use('/api/orders', orderRouter)
    app.use('/api/users', userRouter)
    app.use('/api/webhook', webhookRouter)

    app.use(ResponseMiddleware.response)
}

export default routeApp