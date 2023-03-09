import bcrypt from "bcrypt"
import UserService from "./UserService.js"

export default class AuthService {
    static async signIn(email, password, userType) {
        const user = await UserService.getOne({ email })
        if (!user.isActive) 
            throw {
                status: "error",
                code: 403,
                message: `Your account has been deactivated. Please contact support for assistance.`
            }

        if (userType !== user.__t) 
            throw { 
                status: "error", 
                code: 403, 
                message: `Access Denied: ${user.__t}s are not allowed to access ${userType}'s app`
            }

        if (!user) throw { status: "error", code: 401, message: "Invalid email address or password" }

        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) 
            throw { status: "error", code: 401, message: "Invalid email address or password" }

        delete user.password
        const accessToken = await UserService.generateAuthToken(user)

        return { user, accessToken}
    }
}