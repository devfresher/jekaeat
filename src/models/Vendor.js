import { mongoose } from 'mongoose';
import User from './User.js';

const vendorSchema = new mongoose.Schema({
    businessName: {
        type: String
    },
    businessAddress: {
        type: String
    }
})

const Vendor = User.discriminator('Vendor', vendorSchema)
export default Vendor