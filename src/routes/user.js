import { Router } from "express"

import AuthController from "../controllers/AuthController.js"
import UserController from "../controllers/UserController.js"
import AuthMiddleware from "../middleware/auth.js"
import ValidationMiddleware from "../middleware/validate.js"

const router = Router()

router.put('/change-password', 
    AuthMiddleware.requireLoggedInUser, 
    ValidationMiddleware.validateRequest(UserController.validateChangePassword),
    UserController.changePassword
)

router.put('/me/deactivate', 
    AuthMiddleware.requireUserType(["Customer", "Vendor"]), 
    UserController.deactivateMyAccount
)

export default router