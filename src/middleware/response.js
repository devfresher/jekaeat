import winston from "winston";

class ResponseMiddleware {
	static response = (data, req, res, next) => {
		const defaultCode = 500;
		const defaultMessage = "Something unexpected went wrong";

		let code
		switch (data.status) {
			case "success":
				code = this.isValidStatusCode(data.code) ? data.code : 200;
				return res.status(code).json({
					status: data.status,
					data: data.data,
					message: data.message
				});

			case "error":
				code = this.isValidStatusCode(data.code) ? data.code : defaultCode;
				return res.status(code).json({
					status: data.status,
					error: {
						code,
						message: data.message || defaultMessage
					}
				});

			default:
				console.log(data);
				code = defaultCode;
				const error = {
					code,
					message: defaultMessage,
				};
				winston.error(error.message, data.exception);
				return res.status(error.code).json({
					status: "error",
					error
				});
		}
	}

	static isValidStatusCode = (code) => {
		return code >= 100 && code <= 599;
	}
}

export default ResponseMiddleware