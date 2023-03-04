import { mongoose, SchemaTypes } from 'mongoose';

const orderSchema = new mongoose.Schema({
    customer: { type: SchemaTypes.ObjectId, ref: 'Customer', required: true },
    vendor: { type: SchemaTypes.ObjectId, ref: 'Vendor', required: true },
    meals: [{
        mealId: { type: SchemaTypes.ObjectId, ref: 'Meal', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    total: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
    paymentStatus: { type: String, enum: ['unpaid', 'pending', 'successful', 'failed'], default: 'unpaid' },
    paymentMethod: { type: String, enum: ['card', 'cash'], default: 'card' },
    paymentInfo: {
        cardNumber: { type: String },
        expirationDate: { type: String },
        cvv: { type: String },
        billingZipCode: { type: String }
    }, 
    deliveryInfo: {
        address: { type: String, required: true },
        nearestLandmark: { type: String },
        deliveryInstructions: { type: String },
        contactName: { type: String, required: true },
        contactPhone: { type: String, required: true }
    },
    createdAt: { type: Date, default: Date.now }
})

const Order = mongoose.model('Order', orderSchema)
export default Order