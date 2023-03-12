import Order from "../models/Order.js";
import Utils from "../utils/Utils.js";
import CustomerService from "./CustomerService.js";
import PaymentService from "./PaymentService.js";
import Paystack from "paystack";
import config, { env } from "../utils/config.js";
import VendorService from "./VendorService.js";

const paystack = Paystack(config[env].paystack.secretKey)

export default class OrderService {
    static async getOne(filterQuery) {
        const order = await Order.findOne(filterQuery)

        if (!order) return false
        return order
    }

    static async getMany(filterQuery, pageFilter) {
        if (!pageFilter || (!pageFilter.page && !pageFilter.limit))
            return await Order.find(filterQuery)

        pageFilter.customLabels = Utils.paginationLabel
        return await Order.paginate(filterQuery, pageFilter)
    }

    static async sumTransactions(filterQuery) {
        const result = await Order.aggregate([
            { $match: filterQuery },
            { $group: { _id: null, totalAmount: { $sum: "$total" } } }
        ])

        const totalAmount = result.length > 0 ? result[0].totalAmount : 0;
        return totalAmount
    }

    static async create(customerId, vendorId, meals, paymentMethod, paymentCallback, deliveryInfo) {
        const customer = await CustomerService.getOne({ _id: customerId })
        if (!customer) throw { status: "error", code: 400, message: "Invalid customer" }

        const vendor = await VendorService.getOne({ _id: vendorId })
        if (!vendor) throw { status: "error", code: 400, message: "Invalid vendor" }

        const orderItems = meals.map(meal => ({
            mealId: meal.mealId,
            quantity: meal.quantity,
            price: meal.unitPrice * meal.quantity
        }));
        const total = orderItems.reduce((acc, item) => acc + item.price, 0);

        let paymentResult = null;
        if (paymentMethod === "online") {
            paymentResult = await paystack.transaction.initialize({
                amount: total * 100,
                name: customer.fullName,
                email: customer.email,
                subaccount: vendor.settlementAccount.subAccountCode,
                percentage_charge: 0.98,
                callback_url: paymentCallback
            })
        }
        const newOrder = Order({
            customer: customerId,
            vendor: vendorId,
            meals: orderItems,
            total,
            deliveryInfo,
            payment: {
                status: "pending",
                method: paymentMethod,
                reference: paymentResult?.data?.reference
            },
            createdAt: Date.now(),
        })

        await newOrder.save()
        return { order: newOrder, paymentUrl: paymentResult.data?.authorization_url }
    }

    static async updatePaymentStatus(paymentRef, newStatus) {
        const order = await this.getOne({ "payment.reference": paymentRef })
        if (!order) throw { status: "error", code: 404, message: "Order does not exist" }

        if (order.status === newStatus) return

        if (order.status === 'paid') {
            const verified = await PaymentService.verifyPayment(paymentRef)
            if (!verified) {
                throw { status: "error", code: 402, message: "Payment not successful" }
            }
        }

        order.payment.status = newStatus
        await order.save()
    }
}