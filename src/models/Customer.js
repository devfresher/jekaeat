import { mongoose } from 'mongoose';
import User from './User.js';
import paginate from 'mongoose-paginate-v2'

const customerSchema = new mongoose.Schema({
    deliveryAddress: {
        type: {
            address: { type: String, required: true },
            nearestLandmark: { type: String },
            city: { type: String },
            country: { type: String },
            contactName: { type: String, required: true },
            contactPhone: { type: String, required: true },
            _id: false
        },
    },
    profileImage: { 
        type: {
            url: String, 
            imageId: String, 
            _id: false
        }
    }
})

customerSchema.plugin(paginate)
const Customer = User.discriminator('Customer', customerSchema)
export default Customer