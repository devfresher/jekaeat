
import fs from "fs";

export default class Utils {
    static createDestination (absDestination) {
        if (!fs.existsSync(absDestination)) {
            fs.mkdirSync(absDestination);
        }
    }
}