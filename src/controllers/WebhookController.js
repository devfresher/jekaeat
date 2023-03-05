import config from "config"
import Utils from "../utils/Utils.js"
import OrderService from "../services/OrderService.js"

const PAYSTACK_SECRET_KEY = config.get("paystack.secretKey")

export default class WebhookController {
    static async paystack(req, res, next) {
        const header = req.headers['x-paystack-signature']
        const payload = JSON.stringify(req.body)

        if (Utils.isValidSignature(header, payload, PAYSTACK_SECRET_KEY)) {
            const event = req.body.event
            const data = req.body.data

            switch (event) {
                case 'charge.success':
                    const reference = data.reference
                    await OrderService.updatePaymentStatus(reference, 'paid')
                    break
                case 'charge.failed':
                    await OrderService.updatePaymentStatus(reference, 'failed')
                    break
            }

            return next({ status: "success", data: "Ok" })
        } else {
            return next({ status: "error", code: 403, message: "Invalid signature"})
        }
    }

}
