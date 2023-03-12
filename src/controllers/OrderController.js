import Joi from "joi"
import joiObjectid from "joi-objectid"
import { isValidObjectId } from "mongoose"
import Paystack from "paystack"

import OrderService from "../services/OrderService.js"
import VendorService from "../services/VendorService.js"
import config, { env } from "../utils/config.js"

Joi.objectId = joiObjectid(Joi)
const paystack = Paystack(config[env].paystack.secretKey)

export default class OrderController {
    static async create(req, res, next) {
        const { vendorId, meals, paymentMethod, paymentCallback, deliveryInfo } = req.body

        if (!isValidObjectId(vendorId)) next({ status: "error", code: 400, message: "Invalid vendor id" })
        const vendor = await VendorService.getOne({ _id: vendorId })
        if (!vendor) next({ status: "error", code: 400, message: "Vendor does not exist" })

        const newOrder = await OrderService.create(
            req.user._id, vendorId, meals, paymentMethod, paymentCallback, deliveryInfo)

        return next({ status: "success", data: newOrder })
    }

    static async verifyPaymentStatus(req, res, next) {
        const { paymentReference } = req.body
        const payment = await paystack.transaction.verify(paymentReference)
        const data = payment.data
        const status = data.status

        switch (status) {
            case 'success':
                await OrderService.updatePaymentStatus(paymentReference, 'paid')
                break
            case 'failed':
                await OrderService.updatePaymentStatus(paymentReference, 'failed')
                break
        }

        const order = await OrderService.getOne({ "payment.reference": paymentReference })
        next({ status: "success", data: order })
    }

    static async myOrders(req, res, next) {
        let userType = req.user.userType.toLowerCase()

        const filterQuery = { [userType]: req.user._id }
        OrderController.#filter(filterQuery, req)

        const orders = await OrderService.getMany(filterQuery, req.query)
        next({ status: "success", data: orders })
    }

    static async myTotalOrders(req, res, next) {
        let filterQuery = { vendor: req.user._id }
        OrderController.#filter(filterQuery, req)

        const total = await OrderService.sumTransactions(filterQuery)
        next({ status: "success", data: total })
    }


    static validateOrder(order) {
        const schema = Joi.object({
            vendorId: Joi.objectId().required(),
            meals: Joi.array().items(
                Joi.object({
                    mealId: Joi.string().required(),
                    quantity: Joi.number().min(1).required(),
                    unitPrice: Joi.number().min(0).required(),
                })
            ).required(),
            paymentMethod: Joi.string().valid('online', 'delivery').required(),
            paymentCallback: Joi.string().uri().required(),
            deliveryInfo: Joi.object({
                address: Joi.string().required(),
                nearestLandmark: Joi.string().allow(''),
                deliveryInstructions: Joi.string().allow(''),
                contactName: Joi.string().required(),
                contactPhone: Joi.string().pattern(/^\d{10}$/).required(),
            }).required()
        })

        return schema.validate(order)
    }

    static validateVerifyPaymentStatus(data) {
        const schema = Joi.object({
            paymentReference: Joi.string().required()
        })

        return schema.validate(data)
    }

    static #filter(filterQuery, req) {
        if (req.query.status === 'completed') filterQuery.status = 'completed'
        if (req.query.status === 'pending') filterQuery.status = 'pending'
        if (req.query.status === 'cancelled') filterQuery.status = 'cancelled'
    }

}
