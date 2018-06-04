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

const MAX_TIME_BETWEEN_PUSHES = 2000;

const AWS = require("aws-sdk");
AWS.config.update({ region: config.awsCredentials.region });
const cloudWatchLogsInstance = new AWS.CloudWatchLogs();
const cloudWatchInstance = new AWS.CloudWatch();

const LOG_STREAM = config.logStreamPrefix + Math.random().toString().substr(2);

const setupWebServer = require("./setupExpress")(config.accessToken);
const setupCloudWatch = require("./setupCloudWatch");
const MessagesBuffer = require("./MessagesBuffer");
const CloudWatchPusher = require("./CloudWatchPusher");
const parseMetrics = require("./parseMetrics");

const buffer = new MessagesBuffer(config.filters);
const pusher = new CloudWatchPusher(cloudWatchLogsInstance, config.logGroup, LOG_STREAM);

let lastPushedTime = 0;

const app = setupWebServer(function(line) {
	buffer.addLog(line);

	if (line.indexOf("sample#memory") !== -1) {
		parseMetrics
		.parseMemoryMetrics(line, cloudWatchInstance)
		.catch(() => {});
	}

	if (line.indexOf("sample#load") !== -1) {
		parseMetrics.parseLoadMetrics(line, cloudWatchInstance)
		.catch(() => {});
	}

	if (
		(buffer.getMessagesCount() > config.batchSize ||
			(Date.now() - lastPushedTime > MAX_TIME_BETWEEN_PUSHES &&
				buffer.getMessagesCount() > 0)) &&
		!pusher.isLocked()
	) {
		pusher.push(buffer.messages);
		buffer.clearMessages();
		lastPushedTime = Date.now();
	}
});

setupCloudWatch(cloudWatchLogsInstance, config.logGroup, LOG_STREAM)
	.then(() => {
		app.listen(config.serverPort, () => console.log(`Server up on port ${config.serverPort}`));
	})
	.catch(error => console.log(error));
