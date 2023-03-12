import axios from 'axios'
import config, { env } from '../utils/config.js'

const paystackChargeUrl = 'https://api.paystack.co/charge'
const paystackTokenizeUrl = 'https://api.paystack.co/charge/tokenize'
const paystackVerifyUrl = 'https://api.paystack.co/transaction/verify'
const paystackCreateSubAccountUrl = 'https://api.paystack.co/subaccount'
const paystackUpdateSubAccountUrl = 'https://api.paystack.co/subaccount'
const paystackListBanksUrl = 'https://api.paystack.co/bank'
const paystackSplitUrl = 'https://api.paystack.co/split'


const authHeader = {
    Authorization: `Bearer ${config[env].paystack.secretKey}`,
    "Content-Type": "application/json"
}
export default class PaymentService {

    static async listBanks() {
        const response = await axios.get(paystackListBanksUrl, { headers: authHeader })
        return response.data.data
    }

    static async createSubAccount(businessName, settlementBankCode, accountNumber, percentageCharge, primaryContactEmail) {
        
        const requestBody = {
            business_name: businessName,
            settlement_bank: settlementBankCode,
            account_number: accountNumber,
            percentage_charge: percentageCharge,
            primary_contact_email: primaryContactEmail
        }
        
        const response = await axios.post(paystackCreateSubAccountUrl, requestBody, { headers: authHeader })
        return response.data.data
    }

    static async initiateSplitPayment(businessName, settlementBankCode, accountNumber, percentageCharge, primaryContactEmail) {
        
        const requestBody = {
            business_name: businessName,
            settlement_bank: settlementBankCode,
            account_number: accountNumber,
            percentage_charge: percentageCharge,
            primary_contact_email: primaryContactEmail
        }
        
        const response = await axios.post(paystackCreateSubAccountUrl, requestBody, { headers: authHeader })
        return response.data.data
    }

    static async updateSubAccount(subAccountCode, businessName, settlementBankCode, accountNumber) {
        const requestBody = {
            business_name: businessName,
            settlement_bank: settlementBankCode,
            account_number: accountNumber,
        }
        
        const response = await axios.put(`${paystackUpdateSubAccountUrl}/${subAccountCode}`, requestBody, { headers: authHeader })
        return response.data.data
    }

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
