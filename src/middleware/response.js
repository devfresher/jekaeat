import winston from "winston";

export default class ResponseMiddleware {
	static response = (info, req, res, next) => {
		const defaultCode = 500;
		const defaultMessage = "Something unexpected went wrong";

		let code, message
		switch (info.status) {
			case "success":
				code = this.isValidStatusCode(info.code) ? info.code : 200;

				return res.status(code).json({
					status: info.status,
					data: info.data,
					message: info.message
				});

			case "error":
				code = this.isValidStatusCode(info.code) ? info.code : defaultCode;
				message = info.message || defaultMessage

				if (code === 500) winston.error(message, info);

				return res.status(code).json({
					status: info.status,
					error: { code, message }
				});

			default:
				code = defaultCode;
				message = defaultMessage

				winston.error(message, info);

				return res.status(code).json({
					status: "error",
					error: { code, message }
				});
		}
	}

	static isValidStatusCode = (code) => {
		return code >= 100 && code <= 599;
	}
}