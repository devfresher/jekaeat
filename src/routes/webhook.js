import { Router } from "express"

import WebhookController from "../controllers/WebhookController.js"

const router = Router()

router.post('/paystack', 
    WebhookController.paystack
)

export default router