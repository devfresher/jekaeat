import { mongoose, SchemaTypes } from 'mongoose';

export const mealCategories = ["Meal pack", "Food stack"]
export const mealTypes = ["Main meal", "Side meal"]

const mealSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    vendor: {
        type: SchemaTypes.ObjectId,
        ref: 'Vendor',
        required: true,
    },
    category: {
        type: String,
        enum: mealCategories,
        required: true
    },
    type: {
        type: String,
        enum: mealTypes,
        validate: {
            validator: function (value) {
                return this.category !== "Food stack" || !!value;
            },
            message: "Type field is required for Food Stack meals"
        }
    },
    isAvailable:{
        type: Boolean,
        default: true
    },
    unitPrice: {
        type: Number,
    },
    image: {
        type: {
            url: String, 
            imageId: String, 
            _id: false
        }
    }
})

const Meal = mongoose.model('Meal', mealSchema)
export default Meal