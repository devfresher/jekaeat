import Meal from "../models/Meal.js"
import Utils from "../utils/Utils.js"
import FileService from "./FileService.js"
import VendorService from "./VendorService.js"


export default class MealService {
    static async getOne(filterQuery) {
        const meal = await Meal.findOne(filterQuery)

        if (!meal) return false
        return meal
    }

    static async getMany(filterQuery, pageFilter) {
        if (!pageFilter || (!pageFilter.page && !pageFilter.limit)) 
            return await Meal.find(filterQuery)

        pageFilter.customLabels = Utils.paginationLabel
        return await Meal.paginate(filterQuery, pageFilter)
    }

    static async create(vendorId, mealData) {
        const vendor = await VendorService.getOne({ _id: vendorId })
        if (!vendor) throw { status: "error", code: 500, message: "Invalid vendor id " }

        let meal = await this.getOne({ name: mealData.name, vendor: vendorId })
        if (meal) throw { status: "error", code: 409, message: `Meal already exist for ${vendor.restaurantName}` }

        const {name, description, category, type, unitPrice, file} = mealData
        const mealImage = await FileService.uploadToCloudinary(file, 'meals')

        meal = new Meal({
            name, description, category, 
            type, unitPrice,  
            vendor: vendorId,
            image: { url: mealImage.secure_url, imageId: mealImage.public_id }
        })

        await meal.save()
        return meal
    }

}