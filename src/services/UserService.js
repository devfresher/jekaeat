import jwt from "jsonwebtoken"
import config from "config"
import bcrypt from "bcrypt"
import User from "../models/User.js"

export default class UserService {
    static model = User

    static async getOne (filterQuery) {
        const user = await this.model.findOne(filterQuery)

        if (!user) return false
        return user
    }

    static async generateAuthToken(user) {
        const expiry = 5 * 60 * 60 * 1000
        try {
            const token = jwt.sign({
                _id: user._id,
                userType: user.__t
            }, config.get("jsonwebtoken.privateKey"), { expiresIn: expiry })
            return {token, expiresAt: new Date(Date.now() + expiry)}
        } catch (ex) {
            throw ({code: 500, message: "Failed to generate auth token.", exception: ex})
        }
    }

    static async hashPassword(password) {
        try {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            return hashedPassword
        } catch (ex) {
            throw ({code: 500, message: "Failed to hash password.", exception: ex})
        }
    }
}
