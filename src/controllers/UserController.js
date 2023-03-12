import Joi from "joi";
import AuthService from "../services/AuthService.js";
import CustomerService from "../services/CustomerService.js";
import UserService from "../services/UserService.js";
import VendorService from "../services/VendorService.js";

export default class UserController {
    static async changePassword(req, res, next) {
        const { currentPassword, newPassword } = req.body
        if (currentPassword === newPassword) {
            next({
                status: "error",
                code: 422,
                message: "Unable to update password. Please ensure that the current password and new password are not the same"
            })
        }

        const user = await UserService.updateUserPassword(req.user._id, currentPassword, newPassword);
        return next({ status: "success", data: user });
    }

    static async deactivateMyAccount(req, res, next) {
        const userId = req.user._id
        const user = await UserService.deactivateUser(userId);

        return next({ status: "success", data: user });
    }

    static async updateSettlementAccount(req, res, next) {
        const userId = req.user._id
        const user = await VendorService.updateSettlementAccount(userId, req.body)

        return next({ status: "success", data: user });
    }

    static async getAllVendors(req, res, next) {
        const vendors = await VendorService.getMany({ isActive: true }, req.query)
        return next({ status: "success", data: vendors });
    }

    static async getFeaturedVendors(req, res, next) {
        const featuredVendors = await VendorService.getMany({ featured: true }, req.query)
        return next({ status: "success", data: featuredVendors });
    }

    static async setFeatured(req, res, next) {
        const { vendorId } = req.params
        let vendor = await VendorService.getOne({ _id: vendorId })
        if (!vendor) return next({ status: "error", code: 404, message: "Vendor not found" })

        vendor = VendorService.setFeatured(vendorId)
        next({ status: "success", data: vendor })
    }

    static async getAllCustomers(req, res, next) {
        const customers = await CustomerService.getMany({ isActive: true }, req.query)
        return next({ status: "success", data: customers });
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

    static validateSettlementAccount(data) {
        const validationSchema = Joi.object({
            accountNumber: Joi.string().trim().required().messages({
                'string.base': 'Account number must be a string',
                'any.required': 'Account number is required',
                'string.empty': 'Account number is not allowed to be empty'
            }),
            accountName: Joi.string().trim().required().messages({
                'string.base': 'Account name must be a string',
                'any.required': 'Account name is required',
                'string.empty': 'Account name is not allowed to be empty'
            }),
            bankCode: Joi.string().trim().required().messages({
                'string.base': 'Bank code must be a string',
                'any.required': 'Bank code is required',
                'string.empty': 'Bank code is not allowed to be empty'
            })
        });

        return validationSchema.validate(data, { abortEarly: false });
    }
}
