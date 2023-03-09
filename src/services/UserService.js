import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import User from "../models/User.js"
import config, { env } from "../utils/config.js"

export default class UserService {
    static model = User

    static async getOne (filterQuery) {
        const user = await this.model.findOne(filterQuery)

        if (!user) return false
        return user
    }
    
    static async updateUserPassword (userId, currentPassword, newPassword) {
        const user = await this.getOne({_id: userId})
        if (!user) throw { status: "error", code: 401, message: "Invalid user" }

        const isValidCurrentPassword = await bcrypt.compare(currentPassword, user.password)
        if (!isValidCurrentPassword) throw { status: "error", code: 401, message: "Invalid current password. Please enter the correct current password and try again." }

        const isSamePassword = await bcrypt.compare(newPassword, user.password)
        if (isSamePassword) throw { status: "error", code: 422, message: "Unable to update password. Please ensure that the current password and new password are not the same." }

        user.password = await this.hashPassword(newPassword)
        await user.save()

        delete user.password
        return user
    }

    static async deactivateUser (userId) {
        const user = await this.getOne({_id: userId})
        if (!user) throw { status: "error", code: 404, message: "User not found" }

        user.isActive = false
        await user.save()
        return user
    }
    
    static async generateAuthToken(user) {
        const expiry = 5 * 60 * 60 * 1000
        try {
            const token = jwt.sign({
                _id: user._id,
                userType: user.__t
            }, config[env].jwt.privateKey, { expiresIn: expiry })
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
