import { mongoose } from 'mongoose'
import paginate from 'mongoose-paginate-v2'

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    phoneNumber: String,
    resetPasswordToken: String,
    resetTokenExpiry: Date
})

userSchema.plugin(paginate)
const User = mongoose.model('User', userSchema)
export default User