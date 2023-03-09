import Joi from "joi";
import AuthService from "../services/AuthService.js";
import UserService from "../services/UserService.js";

export default class UserController {
    static async changePassword(req, res, next) {
        const {currentPassword, newPassword} = req.body
        if (currentPassword === newPassword) {
            next({
                status: "error", 
                code: 422, 
                message: "Unable to update password. Please ensure that the current password and new password are not the same"
            })
        }
        
        const user = await UserService.updateUserPassword(req.user._id, currentPassword, newPassword);
        return next({ status: "success", data: user});
    }

    static async deactivateMyAccount(req, res, next) {
        const userId = req.user._id
        const user = await UserService.deactivateUser(userId);
        
        return next({ status: "success", data: user});
    }


    static validateChangePassword(data) {
        const validationSchema = Joi.object({
            currentPassword: Joi.string().required().trim().messages({
                'string.base': 'Current password must be a string',
                'any.required': 'Current password is required'
            }),
            newPassword: Joi.string().required().trim().messages({
                'string.base': 'New password must be a string',
                'any.required': 'New password is required'
            })
        });
    
        return validationSchema.validate(data, { abortEarly: false });
    }
}
