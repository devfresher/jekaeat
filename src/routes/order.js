import { Router } from "express"

import OrderController from "../controllers/OrderController.js"
import AuthMiddleware from "../middleware/auth.js"
import ValidationMiddleware from "../middleware/validate.js"

const router = Router()

router.post('/new', 
    AuthMiddleware.authenticateUserType("Customer"), 
    ValidationMiddleware.validateRequest(OrderController.validateOrder),
    OrderController.create
)
router.get('/customer/me', 
    AuthMiddleware.authenticateUserType("Customer"), 
    OrderController.myOrders
)
router.put('/verify-payment-status', 
    AuthMiddleware.authenticateUserType("Customer"), 
    ValidationMiddleware.validateRequest(OrderController.validateVerifyPaymentStatus),
    OrderController.verifyPaymentStatus
)

router.get('/vendor/me', 
    AuthMiddleware.authenticateUserType("Vendor"), 
    OrderController.myOrders
)
router.get('/vendor/me/total', 
    AuthMiddleware.authenticateUserType("Vendor"), 
    OrderController.myTotalOrders
)

export default router