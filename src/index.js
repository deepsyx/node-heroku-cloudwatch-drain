"use strict";

const path = require("path");

const fileFromArgument = process.argv[2];

if (!fileFromArgument) {
	console.error(
		"Please specify config file: \n Example: $ node-heroku-cloudwatch-drain config.js"
	);
	return process.exit(1);
}

let config;

try {
	config = require(path.resolve(process.cwd(), process.argv[2]));
} catch (e) {
	console.log("Invalid config file.");
	return process.exit(1);
}

const AWS = require("aws-sdk");
AWS.config.update({ region: config.awsCredentials.region });
const cloudWatchInstance = new AWS.CloudWatchLogs();

const LOG_STREAM = config.logStreamPrefix + Math.random().toString().substr(2);

const setupWebServer = require("./setupExpress")("AccessToken");
const setupCloudWatch = require("./setupCloudWatch");
const MessagesBuffer = require("./MessagesBuffer");
const CloudWatchPusher = require("./CloudWatchPusher");

const buffer = new MessagesBuffer(config.filters);
const pusher = new CloudWatchPusher(cloudWatchInstance, config.logGroup, LOG_STREAM);

const app = setupWebServer(function(line) {
	buffer.addLog(line);

	if (buffer.getMessagesCount() > config.batchSize && !pusher.isLocked()) {
		pusher.push(buffer.messages);
		buffer.clearMessages();
	}
});

setupCloudWatch(cloudWatchInstance, config.logGroup, LOG_STREAM)
	.then(() => {
		app.listen(config.serverPort, () => console.log(`Server up on port ${config.serverPort}`));
	})
	.catch(error => console.log(error));
