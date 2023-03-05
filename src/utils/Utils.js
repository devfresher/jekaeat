
import crypto from 'crypto'

export default class Utils {
    static createDestination (absDestination) {
        if (!fs.existsSync(absDestination)) {
            fs.mkdirSync(absDestination);
        }
    }

    static isValidSignature (signature, body, secretKey) {
        const hash = crypto.createHmac('sha512', secretKey)
          .update(JSON.stringify(body))
          .digest('hex');
        
        return hash === signature;
      }
}