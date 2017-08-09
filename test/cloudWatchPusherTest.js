const assert = require("assert");

const CloudWatchPusher = require("../src/CloudWatchPusher");

function MockCloudWatchInstance() {
	return {
		putLogEvents: function() {
			return {
				promise: function() {
					return new Promise(resolve => {
						setTimeout(
							() =>
								resolve({
									nextSequenceToken: "nextSeqToken1",
								}),
							500
						);
					});
				},
			};
		},
	};
}

describe("class CloudWatchPusher", function() {
	it("new instance should not be locked and have no sequence token", function() {
		const inst = new CloudWatchPusher(MockCloudWatchInstance(), "123", "456");

		assert.equal(inst.sequenceToken, null);
		assert.equal(inst.isLocked(), false);
	});

	it("should be able to push list of messages and test locking mechanism", function(done) {
		const inst = new CloudWatchPusher(MockCloudWatchInstance(), "123", "456");

		const promise = inst.push([
			{
				timestamp: Date.now(),
				message: "message from heroku",
			},
		]);

		assert.equal(inst.isLocked(), true); // it should be unlocked after 500ms, see mocked class above
		assert.equal(inst.sequenceToken, null);

		promise.then(() => {
			assert.equal(inst.isLocked(), false);
			assert.equal(inst.sequenceToken, "nextSeqToken1");
			done();
		});
	});
});
