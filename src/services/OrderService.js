import Order from "../models/Order.js";
import PaymentService from "./PaymentService.js";

export default class OrderService {
    static async create(customerId, vendorId, meals, paymentMethod, paymentInfo, deliveryInfo) {
        
        const orderItems = meals.map(meal => ({
            mealId: meal.mealId,
            quantity: meal.quantity,
            price: meal.unitPrice * meal.quantity
        }));
        const total = orderItems.reduce((acc, item) => acc + item.price, 0);
        
        // Process payment
        let paymentResult = null;
        if (paymentMethod === "card") {
            paymentResult = await PaymentService.processCardPayment(
                paymentInfo.cardNumber,
                paymentInfo.expirationDate,
                paymentInfo.cvv,
                paymentInfo.billingZipCode,
                total
            );
        }

        const newOrder = Order({
            customer: customerId,
            vendor: vendorId,
            meals: orderItems,
            total,
            deliveryInfo,
            paymentMethod,
            paymentInfo,
            createdAt: Date.now(),
            paymentResult
        })

        await newOrder.save()
        return newOrder
    }

}