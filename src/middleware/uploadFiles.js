import multer from "multer"
import path from "path"
import Utils from "../utils/Utils"

export default class FileUploadMiddleware {
    static #supportedFormats = {
        image: [".jpeg", ".jpg", ".png"],
        csv: [".csv"]
    }

    static #maxFileSize = 60 * 1024 * 1024

    static createMulter = (fieldName, formats, destination) =>  multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, destination)
            },
            filename: (req, file, cb) => {
                cb(null, file.originalname)
            }
        }),
        fileFilter: (req, file, cb) => {
            const ext = path.extname(file.originalname)
            if (!formats.includes(ext)) {
                req.fileValidationError = `Unsupported file format. Expecting ${formats.join(", ")} file(s) only`
                cb(null, false)
            } else {
                cb(null, true)
            }
        },
        limits: { fileSize: this.#maxFileSize, files: 1 }
    }).single(fieldName)

    static #uploadFile = (fieldName, format, destination = "tempUploads") => {
        const absDestination = path.resolve(process.cwd(), destination)
        Utils.createDestination(absDestination)
    
        const upload = createMulter(fieldName, this.#supportedFormats[format], destination)
    
        return (req, res, next) => {
            upload(req, res, err => {
                if (err instanceof multer.MulterError) {
                    return next({ status: "error", code: 400, message: err.message })
                } else if (err) {
                    return next(err)
                } else if (req.fileValidationError) {
                    return next({ status: "error", code: 400, message: req.fileValidationError })
                }
                next()
            })
        }
    }

    static uploadSingleImage = (fieldName, destination) =>
       FileUploadMiddleware.#uploadFile(fieldName, "image", destination)

    static uploadBatchCsv = (fieldName, destination) =>
        FileUploadMiddleware.#uploadFile(fieldName, "csv", destination)
}


