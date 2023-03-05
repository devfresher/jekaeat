import Order from "../models/Order.js";
import CustomerService from "./CustomerService.js";
import PaymentService from "./PaymentService.js";

export default class OrderService {
    static async getOne(filterQuery) {
        const order = await Order.findOne(filterQuery)

        if (!order) return false
        return order
    }

    static async create(customerId, vendorId, meals, paymentMethod, paymentInfo, deliveryInfo) {

        const orderItems = meals.map(meal => ({
            mealId: meal.mealId,
            quantity: meal.quantity,
            price: meal.unitPrice * meal.quantity
        }));
        const total = orderItems.reduce((acc, item) => acc + item.price, 0);

        let paymentResult = null;
        if (paymentMethod === "card") {
            const [expirationMonth, expirationYear] = paymentInfo.expirationDate.split("/");
            const cardInfo = {
                ...paymentInfo, expirationMonth, expirationYear,
            };

            const customer = await CustomerService.getOne({ _id: customerId })
            if (!customer) throw { status: "error", code: 400, message: "Invalid customer" }

            paymentResult = await PaymentService.processCardPayment(cardInfo, customer, total);
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
                reference: paymentResult.reference
            },
            createdAt: Date.now(),
        })

        await newOrder.save()
        return newOrder
    }

    static async updatePaymentStatus(paymentRef, newStatus) {
        const order = await this.getOne({"payment.reference": paymentRef})
        if (!order) throw { status: "error", code: 404, message: "Order does not exist" }

        if (order.status === newStatus) return

        if (order.status === 'paid') {
            const verified = await PaymentService.verifyPayment(paymentRef)
            if (!verified) {
                throw {status: "error", code: 402, message: "Payment not successful"}
            }
        }

        order.payment.status = newStatus
        await order.save()
    }
}