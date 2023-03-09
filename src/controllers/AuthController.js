import Joi from "joi";
import AuthService from "../services/AuthService.js";
import CustomerService from "../services/CustomerService.js";
import VendorService from "../services/VendorService.js";

export default class AuthController {
    static async signUp(req, res, next) {
        let newUser;
        const { type } = req.body;

        if (type === "Customer") {
            newUser = await CustomerService.create(req.body);
        } else if (type === "Vendor") {
            newUser = await VendorService.create(req.body);
        } else {
            return next({ status: "error", code: 400, message: "Invalid customer" });
        }

        return next({ status: "success", data: newUser });
    }

    static async signIn(req, res, next) {
        const {email, password, type} = req.body
        const signInData = await AuthService.signIn(email, password, type);

        return next({ status: "success", data: signInData });
    }


    // Validations
    static validateSignUp(data) {
        const validationSchema = Joi.object({
            fullName: Joi.string().required().trim().messages({
                'string.empty': 'Full name is required',
            }),
            email: Joi.string().email().required().trim().messages({
                'string.empty': 'Email is required',
                'string.email': 'Please provide a valid email address',
            }),
            password: Joi.string().min(6).required().trim().messages({
                'string.empty': 'Password is required',
                'string.min': 'Password should be at least 6 characters long',
            }),
            phoneNumber: Joi.string().max(15).required().trim().messages({
                'string.empty': 'Phone number is required',
                'string.max': 'Phone number should not be longer than 15 characters',
            }),
            type: Joi.string().valid('Customer', 'Vendor').trim().required().messages({
                'string.empty': 'Account type is required',
                'any.only': 'Invalid account type',
            }),
            address: Joi.string().when('type', { is: 'Customer', then: Joi.required() }).trim().messages({
                'string.empty': 'Address is required',
            }),
            restaurantName: Joi.string().when('type', { is: 'Vendor', then: Joi.required() }).trim().messages({
                'string.empty': 'Restaurant name is required',
            }),
        });

        return validationSchema.validate(data, { abortEarly: false });
    }

    static validateSignIn(data) {
        const validationSchema = Joi.object({
            email: Joi.string().email().required().trim().messages({
                'string.email': 'Email must be a valid email address',
                'string.empty': 'Email is required'
            }),
            password: Joi.string().required().trim().messages({
                'string.empty': 'Password is required'
            }),
            type: Joi.string().required().valid('Customer', 'Vendor').trim().messages({
                'string.empty': 'Account type is required',
                'any.only': 'Invalid account type',
            })
        });

        return validationSchema.validate(data, { abortEarly: false });
    }
}
