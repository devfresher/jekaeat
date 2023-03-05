import axios from 'axios';
import { config } from 'winston';

export default class PaymentService {

    static async #createChargeToken(cardNumber, expirationMonth, expirationYear, cvv) {
        const response = await axios.post(
            'https://api.paystack.co/charge/tokenize',
            {
                card: {
                    number: cardNumber,
                    cvv,
                    expiry_month: expirationMonth,
                    expiry_year: expirationYear,
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${config.get(PAYSTACK_SECRET_KEY)}`,
                },
            },
        );
        if (response.data.status === 'success') {
            return response.data.data.authorization_code;
        } else {
            throw new Error(`Creating charge token failed: ${response.data.message}`);
        }
    }

    static async chargeToken(authorizationCode, amount) {
        const response = await axios.post(
            'https://api.paystack.co/charge',
            {
                authorization_code: authorizationCode,
                amount: amount * 100, // Paystack amount is in kobo (1 NGN = 100 kobo)
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                },
            },
        );
        if (response.data.status === 'success') {
            return response.data.data.authorization_code;
        } else {
            throw new Error(`Payment failed: ${response.data.message}`);
        }
    }
    static async processCardPayment(cardNumber, expirationMonth, expirationYear, cvv, amount) {
        const authCode = this.#createChargeToken(cardNumber, expirationMonth, expirationYear, cvv)
        charge
    }
}
