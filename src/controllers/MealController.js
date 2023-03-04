import Joi from "joi";
import joiObjectid from "joi-objectid";

import MealService from "../services/MealService.js";

Joi.objectId = joiObjectid(Joi)

export default class MealController {
    static async create(req, res, next) {
        const mealData = {
            name: req.body.name,
            description: req.body.description,
            category: req.body.categoryId,
            isSideMeal: req.body.isSideMeal,
            unitPrice: req.body.unitPrice
        }
        const newMeal = await MealService.create(req.user._id, mealData);
        return next({ status: "success", data: newMeal });
    }

    static validateNewMeal(data) {
        const schema = Joi.object({
            name: Joi.string().required(),
            description: Joi.string(),
            categoryId: Joi.objectId(),
            isSideMeal: Joi.boolean(),
            unitPrice: Joi.number(),
        });

        return schema.validate(data);
    }
}
