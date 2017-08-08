"use strict";

module.exports = class CloudWatchPusher {
	constructor(cloudWatchInstance, group, stream) {
		this.cloudWatchInstance = cloudWatchInstance;
		this.group = group;
		this.stream = stream;
		this.sequenceToken = null;

		this.lastPushCompleted = true;
	}

	isLocked() {
		return !this.lastPushCompleted;
	}

	push(messages) {
		const params = {
			logEvents: messages.concat([]),
			logGroupName: this.group,
			logStreamName: this.stream,
			sequenceToken: this.sequenceToken,
		};

		this.lastPushCompleted = false;

		this.cloudWatchInstance.putLogEvents(params).promise().then(data => {
			this.lastPushCompleted = true;
			this.sequenceToken = data.nextSequenceToken;
		});
	}
};
