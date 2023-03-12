import { Router } from "express"

import UserController from "../controllers/UserController.js"
import AuthMiddleware from "../middleware/auth.js"
import ValidationMiddleware from "../middleware/validate.js"

const router = Router()

router.put('/change-password', 
    AuthMiddleware.authenticateToken, 
    ValidationMiddleware.validateRequest(UserController.validateChangePassword),
    UserController.changePassword
)

router.put('/me/deactivate', 
    AuthMiddleware.authenticateUserType(["Customer", "Vendor"]), 
    UserController.deactivateMyAccount
)

router.put('/me/settlement-account', 
    AuthMiddleware.authenticateUserType("Vendor"), 
    ValidationMiddleware.validateRequest(UserController.validateSettlementAccount),
    UserController.updateSettlementAccount
)

router.get('/vendors', 
    UserController.getAllVendors
)

router.get('/vendors/featured', 
    UserController.getFeaturedVendors
)

router.patch('/vendors/:vendorId/featured', 
    AuthMiddleware.authenticateUserType("Admin"),
    ValidationMiddleware.validateObjectIds('vendorId'),
    UserController.setFeatured
)

router.get('/customers',
    // AuthMiddleware.authenticateUserType("Admin"), 
    UserController.getAllCustomers
)

export default router