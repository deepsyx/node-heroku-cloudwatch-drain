function isValid(log, filters) {
	if (!log || !log.trim()) {
		return false;
	}

	for (let i = 0; i < filters.length; i++) {
		if (filters[i].test(log)) {
			return false;
		}
	}

	return true;
}

class MessagesBuffer {
	constructor(filters) {
		this.messages = [];
		this.filters = filters || [];
	}

	getMessagesCount() {
		return this.messages.length;
	}

	clearMessages() {
		this.messages = [];
	}

	addLog(log) {
		if (isValid(log, this.filters)) {
			this.messages.push({
				timestamp: Date.now(),
				message: log.trim(),
			});
		}
	}
}

module.exports = MessagesBuffer;
module.exports.isValid = isValid;
