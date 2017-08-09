const assert = require("assert");

const MessagesBuffer = require("../src/MessagesBuffer");

describe("class MessagesBuffer", function() {
	it("should be able to add one message and remove it, without filters", function() {
		const inst = new MessagesBuffer();
		assert.equal(inst.getMessagesCount(), 0);

		const MESSAGE = "  some message  ";

		inst.addLog(MESSAGE);
		assert.equal(inst.getMessagesCount(), 1);
		assert.equal(inst.messages[0].timestamp, Date.now());
		assert.equal(inst.messages[0].message, MESSAGE.trim());

		inst.clearMessages();
		assert.equal(inst.getMessagesCount(), 0);
	});

	it("should not be able to add a empty or spaces only message", function() {
		const inst = new MessagesBuffer();
		assert.equal(inst.getMessagesCount(), 0);

		inst.addLog("        "); // empty spaces
		assert.equal(inst.getMessagesCount(), 0);

		inst.addLog("");
		assert.equal(inst.getMessagesCount(), 0);

		inst.addLog(null);
		assert.equal(inst.getMessagesCount(), 0);
	});

	it("should not add messages that don't pass the filter", function() {
		const FILTERS = [/bad word/];
		const inst = new MessagesBuffer(FILTERS);

		inst.addLog("this sentence has bad word");
		assert.equal(inst.getMessagesCount(), 0);

		inst.addLog("this sentence has good word");
		assert.equal(inst.getMessagesCount(), 1);
	});
});
