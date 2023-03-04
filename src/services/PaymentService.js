import axios from 'axios';

export default class PaymentService {
    static async processCardPayment(cardNumber, expirationMonth, expirationYear, cvv, amount) {
        const response = await axios.post(
            'https://api.paystack.co/charge',
            {
                card: {
                    number: cardNumber,
                    cvv,
                    expiry_month: expirationMonth,
                    expiry_year: expirationYear,
                },
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
}
