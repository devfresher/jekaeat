import dotenv from 'dotenv'
dotenv.config()

export const env = process.env.NODE_ENV || 'development'
export default {
    development: {
        app: {
            name: "Jekaeat"
        },
        paystack: {
            secretKey: process.env.PAYSTACK_SECRET_KEY
        },
        jwt: {
            privateKey: process.env.JWT_PRIVATE_KEY
        },
        db: {
            url: process.env.DB_URL
        },
        cloudinary: {
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_KEY,
            api_secret: process.env.CLOUDINARY_SECRET,
            secure: true
        }
    },
    test: {

    },
    production: {
        app: {
            name: "Jekaeat"
        },
        paystack: {
            secretKey: process.env.PAYSTACK_SECRET_KEY
        },
        jwt: {
            privateKey: process.env.JWT_PRIVATE_KEY
        },
        db: {
            url: process.env.DB_URL
        },
        cloudinary: {
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_KEY,
            api_secret: process.env.CLOUDINARY_SECRET,
            secure: true
        }
    }
}