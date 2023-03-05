import axios from 'axios'
import config from 'config'

const PAYSTACK_SECRET_KEY = config.get('paystack.secretKey')
const paystackChargeUrl = 'https://api.paystack.co/charge'
const paystackTokenizeUrl = 'https://api.paystack.co/charge/tokenize'
const paystackVerifyUrl = 'https://api.paystack.co/transaction/verify'

const authHeader = {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json"
}
export default class PaymentService {

    static async createChargeToken(cardNumber, expirationMonth, expirationYear, cvv, email) {
        const requestBody = {
            email,
            card: {
                number: cardNumber,
                cvv,
                expiry_month: expirationMonth,
                expiry_year: expirationYear,
            }
        }
        
        const response = await axios.post(paystackTokenizeUrl, requestBody, { headers: authHeader })
        return response.data.data.authorization_code
    }

    static async chargeToken(authorizationCode, amount, email) {
        const requestBody = {
            email,
            authorization_code: authorizationCode,
            amount: amount * 100,
        }
        
        const response = await axios.post(paystackChargeUrl, requestBody, { headers: authHeader })
        return response.data.data
    }

    static async verifyPayment(paymentRef, amount) {        
        const response = await axios.post(`${paystackVerifyUrl}/${paymentRef}`, { headers: authHeader })
        const transaction = response.data.data

        // Check if transaction is successful and has the expected amount
        if (transaction.status === 'success' && transaction.amount === amount * 100) {
            return true
        }

        return false
    }

    static async processCardPayment(cardInfo, user, amount) {
        const { cardNumber, expirationMonth, expirationYear, cvv } = cardInfo
        const { email } = user

        const authCode = await this.createChargeToken(cardNumber, expirationMonth, expirationYear, cvv, email)
        const response = await this.chargeToken(authCode, amount, email)

        if (response.status === 'success') {
            return response
        } else {
            throw { status: "error", code: 500, msg: response.data.message }
        }
    }
}
