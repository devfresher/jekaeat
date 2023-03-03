import Vendor from "../models/Vendor.js"
import UserService from "./UserService.js"

export default class VendorService extends UserService {
    static async create (userData) {
        const user = await this.getOne({email: userData.email})
        if (user) throw {status: "error", code: 409, message: "User already exist"}

        let newVendor = new Vendor({
            fullName: userData.fullName,
            email: userData.email,
            password: await this.hashPassword(userData.password),
            phoneNumber: userData.phoneNumber,
            businessName: userData.businessName,
            businessAddress: userData.businessAddress
        })

        await newVendor.save()
        return newVendor
    }    
}