import { mongoose } from 'mongoose';
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
    businessImage: { 
        type: {
            url: String, 
            imageId: String, 
            _id: false
        }
    }
})

const Vendor = User.discriminator('Vendor', vendorSchema)
export default Vendor