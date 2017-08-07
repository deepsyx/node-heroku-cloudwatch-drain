const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.raw({ type: "application/logplex-1", limit: "10mb" }));

let onRequestCallback = () => console.log("[WARNING] onNewMessage not set!");

function parseMessages(body) {
	return body.replace(/^\d+ /, "").split(/\n\d+ /);
}

app.post("/log", function(req, res) {
	res.status(200).end("OK");

	const body = String(req.body.toString("utf8"));
	if (!body) {
		return;
	}

	const messages = parseMessages(body);
	messages.forEach(message => onRequestCallback(message));
});

app.use(function(req, res) {
	res.status(400).end("Invalid request");
});

module.exports = {
	onNewMessage: function(callback) {
		onRequestCallback = callback;
	},
	start: function(serverPort) {
		app.listen(serverPort, () => {
			console.log(`Server up on ${serverPort}`);
		});
	},
};
