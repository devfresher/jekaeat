import _ from 'lodash'
import { isValidObjectId } from "mongoose"

export default class ValidationMiddleware {
    static validateRequest = (validator) => {
        return (req, res, next) => {
            const validationResult = validator(req.body)
            if (validationResult.error) {
                const errorMessage = validationResult.error.details[0].message
                return next({ status: 'error', code: 400, message: errorMessage })
            }
            next()
        }
    }

    static validateObjectIds = (idNames) => {
        return (req, res, next) => {
            idNames = Array.isArray(idNames) ? idNames : [idNames]
            const invalidId = _.find(idNames, idName => !isValidObjectId(req.params[idName]))
            if (invalidId) {
                return next({ status: "error", code: 400, message: `Invalid ${ invalidId } passed` })
            }
            next()
        }
    }

    static validateQueryObjectIds = (idNames) => {
        return (req, res, next) => {
            idNames = Array.isArray(idNames) ? idNames : [idNames]
            const invalidId = _.find(idNames, idName => !isValidObjectId(req.query[idName]))
            if (invalidId) {
                return next({ status: "error", code: 400, message: `Invalid ${ invalidId } passed` })
            }
            next()
        }
    }
}