import Joi from "joi";
import { mealCategories, mealTypes } from "../models/Meal.js";

import MealService from "../services/MealService.js";

export default class MealController {
    static async create(req, res, next) {
        if (!req.file) next({ status: "error", code: 400, message: "Upload a meal image" })

        const mealData = req.body
        mealData.file = req.file

        const newMeal = await MealService.create(req.user._id, mealData);
        return next({ status: "success", data: newMeal });
    }

    static async myMeals(req, res, next) {
        const filterQuery = { vendor: req.user._id }
        if (req.query.status === 'available') filterQuery.isAvailable = true
        if (req.query.status === 'unavailable') filterQuery.isAvailable = false

        const meal = await MealService.getMany(filterQuery, req.query);
        return next({ status: "success", data: meal });
    }

    static validateNewMeal(data) {
        const schema = Joi.object({
            name: Joi.string().trim().required().messages({
                'string.base': 'Name must be a string',
                'string.empty': 'Name cannot be empty',
                'any.required': 'Name is required'
            }),
            description: Joi.string().trim().allow('').messages({
                'string.base': 'Description must be a string'
            }),
            category: Joi.string().valid(...mealCategories).required().messages({
                'string.base': 'Category must be a string',
                'string.empty': 'Category cannot be empty',
                'any.only': `Category must be one of ${mealCategories.join(', ')}`,
                'any.required': 'Category is required'
            }),
            type: Joi.when('category', {
                is: 'Food stack',
                then: Joi.string().valid(...mealTypes).required().messages({
                    'string.base': 'Type must be a string',
                    'string.empty': 'Type cannot be empty',
                    'any.only': `Type must be one of ${mealTypes.join(', ')}`,
                    'any.required': 'Type is required for food stack category'
                }),
                otherwise: Joi.string().optional().messages({
                    'string.base': 'Type must be a string'
                })
            }),
            unitPrice: Joi.number().required().messages({
                'number.base': 'Unit price must be a number',
                'number.empty': 'Unit price cannot be empty',
                'any.required': 'Unit price is required'
            })
        });

        return schema.validate(data, { abortEarly: false });
    }

}
