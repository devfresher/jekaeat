import { mongoose, SchemaTypes } from 'mongoose';
import paginate from "mongoose-paginate-v2";

const orderSchema = new mongoose.Schema({
    customer: { type: SchemaTypes.ObjectId, ref: 'Customer', required: true },
    vendor: { type: SchemaTypes.ObjectId, ref: 'Vendor', required: true },
    meals: [{
        mealId: { type: SchemaTypes.ObjectId, ref: 'Meal', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        _id: false
    }],
    total: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
    payment: {
        method: { type: String, enum: ['card', 'cash'], default: 'card' },
        status: { type: String, enum: ['unpaid', 'pending', 'paid', 'failed'], default: 'unpaid' },
        reference: { type: String },
        _id: false
    },
    deliveryInfo: {
        address: { type: String, required: true },
        nearestLandmark: { type: String },
        deliveryInstructions: { type: String },
        contactName: { type: String, required: true },
        contactPhone: { type: String, required: true },
        _id: false
    },
    createdAt: { type: Date, default: Date.now }
})

orderSchema.plugin(paginate)
const Order = mongoose.model('Order', orderSchema)
export default Order