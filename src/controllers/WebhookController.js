import Utils from "../utils/Utils.js"
import config, { env } from "../utils/config.js"
import OrderService from "../services/OrderService.js"

export default class WebhookController {
    static async paystack(req, res, next) {
        const header = req.headers['x-paystack-signature']
        const payload = JSON.stringify(req.body)

        if (Utils.isValidSignature(header, payload, config[env].paystack.secretKey)) {
            const event = req.body.event
            const data = req.body.data
            const reference = data.reference

            switch (event) {
                case 'charge.success':
                    await OrderService.updatePaymentStatus(reference, 'paid')
                    break
                case 'charge.failed':
                    await OrderService.updatePaymentStatus(reference, 'failed')
                    break
            }

            return next({ status: "success", data: "Ok" })
        } else {
            return next({ status: "error", code: 403, message: "Invalid signature" })
        }
    }

}
