import cloud from 'cloudinary'
import config, { env } from '../utils/config.js';

const cloudinary = cloud.v2
cloudinary.config(config[env].cloudinary);

const UPLOAD_FOLDER = 'jekaeat'
export default class FileService {
    static async uploadToCloudinary(file, folder, imagePublicId) {
        let uploadSettings = {}
        uploadSettings.folder = folder ? `${UPLOAD_FOLDER}/${folder}`: `${UPLOAD_FOLDER}`
        if (imagePublicId) uploadSettings.public_id = imagePublicId

        try {
            return await cloudinary.uploader.upload(file.path, uploadSettings)
        } catch (error) {
            throw { message: error }
        }
    }

    static async deleteFromCloudinary(imagePublicId) {
        try {
            return await cloudinary.uploader.destroy(imagePublicId)
        } catch (error) {
            throw { message: error }
        }
    }
}