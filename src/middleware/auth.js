import jwt from 'jsonwebtoken';
import config from 'config';
import UserService from '../services/UserService.js';

export default class AuthMiddleware {
    static async requireLoggedInUser  (req, res, next) {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.replace(/^Bearer\s+/, '');
            if (!token) {
                return next({
                    status: 'error',
                    code: 401,
                    message: 'Access denied. No auth token provided'
                });
            }
    
            const decodedToken = jwt.verify(token, config.get('jsonwebtoken.privateKey'));
            const user = await UserService.getOne({_id: decodedToken._id});
            if (!user) {
                return next({
                    status: 'error',
                    code: 401,
                    message: 'Invalid auth token'
                });
            }
    
            req.user = decodedToken;
            next();
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return next({
                    status: 'error',
                    code: 401,
                    message: 'Auth token expired'
                });
            }
    
            return next({
                status: 'error',
                code: 401,
                message: 'Failed to authenticate token'
            });
        }
    };

    static requireUserType (roles) {
        
        return async (req, res, next) => {
            await this.requireLoggedInUser(req, res, error => {
                if (error) return next(error);
    
                roles = Array.isArray(roles) ? roles : [roles];
                if (!roles.includes(req.user.userType)) {
                    return next({
                        status: 'error',
                        code: 403,
                        message: 'Token valid, but forbidden to take this action'
                    });
                }
    
                next();
            });
        };
    };
}