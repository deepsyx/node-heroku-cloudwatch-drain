"use strict";

const path = require("path");

const config = require(path.resolve(process.cwd(), process.argv[2]));

const AWS = require("aws-sdk");
AWS.config.update({ region: config.awsCredentials.region });
const cloudWatchInstance = new AWS.CloudWatchLogs();

const app = require("./setupExpress");
const setupCloudWatch = require("./setupCloudWatch");
const MessagesBuffer = require("./MessagesBuffer");
const CloudWatchPusher = require("./CloudWatchPusher");

const buffer = new MessagesBuffer(config.filters);
const pusher = new CloudWatchPusher(cloudWatchInstance, config.logGroup, config.logStreamPrefix);

app.onNewMessage(function(line) {
	buffer.addLog(line);

	if (buffer.getMessagesCount() > config.batchSize && !pusher.isLocked()) {
		pusher.push(buffer.messages);
		buffer.clearMessages();
	}
});

setupCloudWatch(
	cloudWatchInstance,
	config.logGroup,
	config.logStreamPrefix + Math.random().toString().substr(2)
)
	.then(() => {
		app.start(config.serverPort);
	})
	.catch(error => console.log(error));
