import asyncErrors from 'express-async-errors'
import logger from './logger.js';
import routeApp from './routes.js';
import serve from './db.js';

export default (app) => {
    logger();
    routeApp(app); 
    serve(app)
}