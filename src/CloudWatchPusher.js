"use strict";

module.exports = class CloudWatchPusher {
	constructor(cloudWatchInstance, group, stream) {
		this.cloudWatchInstance = cloudWatchInstance;
		this.group = group;
		this.stream = stream;
		this.sequenceToken = sequenceToken;

		this.lastPushCompleted = true;
	}

	isLocked() {
		return !this.lastPushCompleted;
	}

	push(messages) {
		const params = {
			logEvents: messages.concat([]),
			logGroupName: config.logGroup,
			logStreamName: LOG_STREAM_NAME,
			sequenceToken: this.sequenceToken,
		};

		this.lastPushCompleted = false;

		cloudwatchlogs.putLogEvents(params).promise().then(data => {
			this.lastPushCompleted = true;
			this.sequenceToken = data.nextSequenceToken;
		});
	}
};
