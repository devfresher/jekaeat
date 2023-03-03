import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'

import authRouter from '../routes/auth.js'
import ResponseMiddleware from '../middleware/response.js'


const routeApp = function (app) {
    app.use(bodyParser.json())
    app.use(cors())
    app.use(helmet())

    app.use('/api/auth', authRouter)

    app.use(ResponseMiddleware.response)
}

export default routeApp