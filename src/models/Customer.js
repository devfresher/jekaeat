import { mongoose } from 'mongoose';
import User from './User.js';

const customerSchema = new mongoose.Schema({
    address: {
        type: String
    }
})

const Customer = User.discriminator('Customer', customerSchema)
export default Customer