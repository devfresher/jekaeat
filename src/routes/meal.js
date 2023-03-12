import { Router } from "express"

import MealController from "../controllers/MealController.js"
import AuthMiddleware from "../middleware/auth.js"
import ValidationMiddleware from "../middleware/validate.js"
import FileUploadMiddleware from "../middleware/uploadFiles.js"

const router = Router()

router.post('/new', 
    AuthMiddleware.authenticateUserType("Vendor"), 
    FileUploadMiddleware.uploadSingleImage("mealImage"),
    ValidationMiddleware.validateRequest(MealController.validateNewMeal),
    MealController.create
)

router.get('/me', 
    AuthMiddleware.authenticateUserType("Vendor"), 
    MealController.myMeals
)
export default router