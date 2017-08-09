const app = require("express")();
const bodyParser = require("body-parser");
const basicAuth = require("express-basic-auth");

app.use(bodyParser.raw({ type: "application/logplex-1", limit: "10mb" }));

function parseMessages(body) {
	return body.replace(/^\d+ /, "").split(/\n\d+ /);
}

module.exports = function(accessToken) {
	return function(onNewMessage) {
		app.use(function(req, res, next) {
			if (req.query.accessToken !== accessToken) {
				return res.status(401).json({
					message: "Invalid token",
				});
			}

			next();
		});

		app.post("/log", function(req, res) {
			res.status(200).end("OK");

			const body = String(req.body.toString("utf8"));
			if (!body) {
				return;
			}

			const messages = parseMessages(body);
			messages.forEach(message => onNewMessage(message));
		});

		app.use(function(req, res) {
			res.status(400).end("Invalid request");
		});

		return app;
	};
};

module.exports.parseMessages = parseMessages;
