import { Router } from "express"

import MealController from "../controllers/MealController.js"
import AuthMiddleware from "../middleware/auth.js"
import ValidationMiddleware from "../middleware/validate.js"

const router = Router()

router.post('/new', 
    AuthMiddleware.requireUserType("Vendor"), 
    ValidationMiddleware.validateRequest(MealController.validateNewMeal),
    MealController.create
)

export default router