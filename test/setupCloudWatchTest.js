const assert = require("assert");

const setupCloudWatch = require("../src/setupCloudWatch");

describe("setup Cloud Watch", function() {
	it("should be able to execute getLogGroup", function(done) {
		const mock = {
			describeLogGroups: function() {
				return {
					promise: function() {
						return Promise.resolve({
							logGroups: [
								{
									logGroupName: "one",
									hallo: true,
								},
								{
									logGroupName: "dve",
									hallo: false,
								},
							],
						});
					},
				};
			},
		};

		setupCloudWatch.getLogGroup(mock, "one").then(group => {
			assert.deepEqual(group, {
				logGroupName: "one",
				hallo: true,
			});

			done();
		});
	});

	it("should be able to execute createLogGroup", function(done) {
		const mock = {
			createLogGroup: function(params) {
				return {
					promise: function() {
						return Promise.resolve(params);
					},
				};
			},
		};

		setupCloudWatch.createLogGroup(mock, "group").then(res => {
			assert.deepEqual(res, { logGroupName: "group" });
			done();
		});
	});

	it("should be able to execute createLogStream", function(done) {
		const mock = {
			createLogStream: function(params) {
				return {
					promise: function() {
						return Promise.resolve(params);
					},
				};
			},
		};

		setupCloudWatch.createLogStream(mock, "group", "stream").then(res => {
			assert.deepEqual(res, {
				logGroupName: "group",
				logStreamName: "stream",
			});
			done();
		});
	});
});
