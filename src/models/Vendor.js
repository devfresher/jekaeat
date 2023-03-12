import { mongoose } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import User from './User.js';

const vendorSchema = new mongoose.Schema({
    restaurantName: { type: String, required: true },
    restaurantLocation: {
        type: {
            address: { type: String },
            city: { type: String },
            _id: false
        }
    },
    schedule: {
        type: [{ day: String, openAt: String, closeAt: String }],
    },
    description: { type: String },
    settlementAccount: {
        type: {
            accountName: String,
            accountNumber: String,
            bank: String,
            subAccountCode: String,
            _id: false
        }
    },
    businessImage: { 
        type: {
            url: String, 
            imageId: String, 
            _id: false
        }
    },
    featured: {
        type: Boolean,
        default: false
    }
})

vendorSchema.plugin(paginate)
const Vendor = User.discriminator('Vendor', vendorSchema)
export default Vendor