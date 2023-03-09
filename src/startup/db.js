import mongoose from 'mongoose'
import winston from 'winston'
import config, { env } from '../utils/config.js';

const name = process.env.APP_NAME
const host = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 5000;

export default async (app) => {
    try {
        mongoose.set('strictQuery', false)
        mongoose.connect(config[env].db.url)
        winston.info(`${name} is connected to DB`)

        app.listen(port, host, () => {
            winston.info(`${name}'s Server started at http://${host}:${port}`)
        })
    } catch (error) {
        winston.error(error)
    }
}