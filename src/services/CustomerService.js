import Customer from "../models/Customer.js"
import UserService from "./UserService.js"

export default class CustomerService extends UserService {
    static model = Customer
    
    static async create (userData) {
        const user = await this.getOne({email: userData.email})
        if (user) throw {status: "error", code: 409, message: "User already exist"}

        let newCustomer = new Customer({
            fullName: userData.fullName,
            email: userData.email,
            password: await this.hashPassword(userData.password),
            phoneNumber: userData.phoneNumber,
            address: userData.address
        })

        await newCustomer.save()
        return newCustomer
    }

}