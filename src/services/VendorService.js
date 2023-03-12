import Vendor from "../models/Vendor.js"
import PaymentService from "./PaymentService.js"
import UserService from "./UserService.js"

export default class VendorService extends UserService {
    static model = Vendor

    static async create(userData) {
        const user = await UserService.getOne({ email: userData.email })
        if (user) throw { status: "error", code: 409, message: "Email already taken." }

        let newVendor = new Vendor({
            fullName: userData.fullName,
            email: userData.email,
            password: await this.hashPassword(userData.password),
            phoneNumber: userData.phoneNumber,
            restaurantName: userData.restaurantName,
        })

        await newVendor.save()
        return newVendor
    }

    static async updateSettlementAccount(userId, accountData) {
        const vendor = await this.getOne({ _id: userId })
        if (!vendor) throw { status: "error", code: 500, msg: "Invalid vendor id" }

        const { accountNumber, accountName, bankCode } = accountData

        let subAccount
        if (vendor.settlementAccount?.subAccountCode) {
            subAccount = await PaymentService.updateSubAccount(
                vendor.settlementAccount.subAccountCode,
                vendor.restaurantName || accountName,
                bankCode,
                accountNumber
            )
        } else {
            subAccount = await PaymentService.createSubAccount(
                vendor.restaurantName || accountName,
                bankCode,
                accountNumber,
                17,
                vendor.email
            )
        }
        vendor.settlementAccount = {
            accountName: subAccount.business_name,
            accountNumber: subAccount.account_number,
            bank: subAccount.settlement_bank,
            subAccountCode: subAccount.subaccount_code
        }

        await vendor.save()
        return vendor
    }

    static async setFeatured(vendorId) {
        const vendor = await VendorService.getOne({ _id: vendorId })
        if (!vendor) return next({ status: "error", code: 404, message: "Vendor not found" })

        vendor.featured = true
        await vendor.save()
    }
}