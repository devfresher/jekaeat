import { mongoose, SchemaTypes } from 'mongoose';

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
        ref: 'Vendor'
    },
    category: {
        type: SchemaTypes.ObjectId,
        ref: 'Category'
    },
    isSideMeal: {
        type: Boolean,
        default: false
    },
    isAvailable:{
        type: Boolean,
        default: true
    },
    unitPrice: {
        type: Number,
    },
})

const Meal = mongoose.model('Meal', mealSchema)
export default Meal