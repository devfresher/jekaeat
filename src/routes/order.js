import { Router } from "express"

import OrderController from "../controllers/OrderController.js"
import AuthMiddleware from "../middleware/auth.js"
import ValidationMiddleware from "../middleware/validate.js"

const router = Router()

router.post('/new', 
    AuthMiddleware.requireUserType("Customer"), 
    ValidationMiddleware.validateRequest(OrderController.validateOrder),
    OrderController.create
)
router.get('/vendor/:vendorId', 
    AuthMiddleware.requireUserType("Vendor"), 
    ValidationMiddleware.validateObjectIds('vendorId'),
    OrderController.getAllByVendorId
)
router.get('/vendor/:vendorId/total-transaction-amount', 
    AuthMiddleware.requireUserType("Vendor"), 
    ValidationMiddleware.validateObjectIds('vendorId'),
    OrderController.getTotalTransactionAmountByVendorId
)

export default router