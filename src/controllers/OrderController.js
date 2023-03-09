import Joi from "joi";
import joiObjectid from "joi-objectid";
import { isValidObjectId } from "mongoose";

import OrderService from "../services/OrderService.js";
import VendorService from "../services/VendorService.js"

Joi.objectId = joiObjectid(Joi)

export default class OrderController {
    static async create(req, res, next) {
        const { vendorId, meals, paymentMethod, paymentInfo, deliveryInfo } = req.body

        if (!isValidObjectId(vendorId)) next({ status: "error", code: 400, message: "Invalid vendor id" })
        const vendor = await VendorService.getOne({ _id: vendorId })
        if (!vendor) next({ status: "error", code: 400, message: "Vendor does not exist" })

        const newOrder = await OrderService.create(
            req.user._id, vendorId, meals, paymentMethod, paymentInfo, deliveryInfo);

        return next({ status: "success", data: newOrder });
    }

    static async getAllByVendorId(req, res, next) {
        const vendor = await VendorService.getOne({ _id: req.params.vendorId })
        if (!vendor) next({ status: "error", code: 500, message: "Invalid vendor" })

        const orders = await OrderService.getMany({ vendor: vendor._id }, req.query)
        next({ status: "success", data: orders })
    }

    static async getTotalTransactionAmountByVendorId(req, res, next) {
        const vendor = await VendorService.getOne({ _id: req.params.vendorId })
        if (!vendor) next({ status: "error", code: 500, message: "Invalid vendor" })

        let filterQuery = { vendor: vendor._id }
        if (req.query.status) filterQuery.status = req.query.status

        const total = await OrderService.sumTransactions(filterQuery)
        next({ status: "success", data: total })
    }


    static validateOrder(order) {
        const schema = Joi.object({
            vendorId: Joi.string().required(),
            meals: Joi.array().items(
                Joi.object({
                    mealId: Joi.string().required(),
                    quantity: Joi.number().min(1).required(),
                    unitPrice: Joi.number().min(0).required(),
                })
            ).required(),
            paymentMethod: Joi.string().valid('card', 'cash').required(),
            paymentInfo: Joi.object().when('paymentMethod', {
                is: 'card',
                then: Joi.object({
                    cardNumber: Joi.string().creditCard().required(),
                    expirationDate: Joi.string().pattern(/^\d{2}\/\d{2}$/).required(),
                    cvv: Joi.string().length(3).required(),
                    billingZipCode: Joi.string().required()
                }).required(),
                otherwise: Joi.object().forbidden()
            }),
            deliveryInfo: Joi.object({
                address: Joi.string().required(),
                nearestLandmark: Joi.string().allow(''),
                deliveryInstructions: Joi.string().allow(''),
                contactName: Joi.string().required(),
                contactPhone: Joi.string().pattern(/^\d{10}$/).required(),
            }).required()
        });

        return schema.validate(order);
    }

}
