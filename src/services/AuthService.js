import bcrypt from "bcrypt"
import UserService from "./UserService.js"
import CustomerService from "./CustomerService.js"
import VendorService from "./VendorService.js"

export default class AuthService {
    static async signIn(email, password, userType) {
        let user
        if (userType === "Customer") {
            user = await CustomerService.getOne({ email })
        } else if (userType === "Vendor") {
            user = await VendorService.getOne({ email })
        } else {
            throw {status: "error",code: 500, msg: "Invalid User Type"}
        }

        if (!user) throw { status: "error", code: 401, message: "Invalid email address or password" }

        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) throw { status: "error", code: 401, message: "Invalid email address or password" }

        delete user.password
        const accessToken = await UserService.generateAuthToken(user)

        return { user, accessToken}
    }

}