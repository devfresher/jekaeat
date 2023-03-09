import fs from 'fs'
import crypto from 'crypto'

export default class Utils {
	static paginationLabel = {
		totalDocs: 'totalItems',
		docs: 'items',
		limit: 'perPage',
		page: 'currentPage',
		hasNextPage: false,
		hasPrevPage: false,
		nextPage: false,
		prevPage: false,
		totalPages: 'pageCount',
		pagingCounter: false,
		meta: 'paging',
	}

	static createDestination(absDestination) {
		if (!fs.existsSync(absDestination)) {
			fs.mkdirSync(absDestination);
		}
	}

	static isValidSignature(signature, body, secretKey) {
		const hash = crypto.createHmac('sha512', secretKey)
			.update(JSON.stringify(body))
			.digest('hex');

		return hash === signature;
	}
}