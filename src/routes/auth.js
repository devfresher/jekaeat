import { Router } from "express"
import AuthController from "../controllers/AuthController.js"

const router = Router()

router.post('/signup', AuthController.signUp)
router.post('/login', AuthController.signIn)

export default router