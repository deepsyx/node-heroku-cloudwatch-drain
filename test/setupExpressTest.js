const assert = require("assert");

const request = require("request");
const setupExpress = require("../src/setupExpress");

describe("setup Express / Web server test", function() {
	it("it should start the web server, send a request and parse the messages from it", function(
		done
	) {
		this.timeout(50000);
		const ACCESS_TOKEN = "AccessToken";

		let newMessageInvokedCount = 0;

		const messages = ["125 hello buddy", "258 hello bro"];
		const expectedLines = ["hello buddy", "hello bro"];

		function onNewMessage(line) {
			assert.equal(line, expectedLines[newMessageInvokedCount]);
			newMessageInvokedCount++;
		}

		const app = setupExpress(ACCESS_TOKEN)(onNewMessage).listen(30000, () => {
			request(
				{
					uri: "http://127.0.0.1:30000/log?accessToken=" + ACCESS_TOKEN,
					method: "POST",
					body: messages.join("\n"),
					headers: {
						"content-type": "application/logplex-1",
					},
				},
				function(err, xhr, body) {
					assert.equal(xhr.statusCode, 200);
					setTimeout(() => {
						assert.equal(newMessageInvokedCount, 2);
						app.close(() => done());
					}, 50);
				}
			);
		});
	});

	it("it should NOT accept a request without valid access token", function(done) {
		this.timeout(5000);
		const app = setupExpress("righttoken")(function noop() {}).listen(30000, () => {
			request(
				{
					uri: "http://127.0.0.1:30000/log?accessToken=wrongtoken",
					method: "POST",
					body: "asd",
					headers: {
						"content-type": "application/logplex-1",
					},
				},
				function(err, xhr, body) {
					assert.equal(xhr.statusCode, 401);
					app.close(() => done());
				}
			);
		});
	});
});
