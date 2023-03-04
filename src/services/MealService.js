import Meal from "../models/Meal.js"
import VendorService from "./VendorService.js"


export default class MealService {
    static async getOne(filterQuery) {
        const meal = await Meal.findOne(filterQuery)

        if (!meal) return false
        return meal
    }

    static async create(vendorId, mealData) {
        const vendor = await VendorService.getOne({ _id: vendorId })
        if (!vendor) throw { status: "error", code: 404, message: "Vendor does not exist" }

        let meal = await this.getOne({ name: mealData.name, vendor: vendorId })
        if (meal) throw { status: "error", code: 409, message: `Meal already exist for ${vendor.businessName}` }

        meal = new Meal({
            ...mealData,
            vendor: vendorId
        })

        await meal.save()
        return meal
    }

}