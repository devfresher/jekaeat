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


    static validateSignUp(data) {
        const { type } = data;
        let validationFilter = {
            fullName: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
            phoneNumber: Joi.string().max(15),
            type: Joi.string().required(),
        };

        if (type === "Customer") {
            validationFilter.address = Joi.string();
        } else if (type === "Vendor") {
            validationFilter.businessName = Joi.string();
            validationFilter.businessAddress = Joi.string();
        }

        const schema = Joi.object(validationFilter);
        return schema.validate(data);
    }

    static validateSignIn(data) {
        let validationFilter = {
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            type: Joi.string().required(),
        };

        const schema = Joi.object(validationFilter);
        return schema.validate(data);
    }
}
