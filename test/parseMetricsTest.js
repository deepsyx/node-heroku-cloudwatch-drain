const assert = require("assert");

const parseMetrics = require("../src/parseMetrics");

describe("parseMetrics", function() {
	it("should be able to parse memory metrics and send them to cloudwatch", function(done) {
		const line =
			"source=web.1 dyno=heroku.27687215.e195835d-0a62-4e51-af3c-ae7f2540a443 sample#memory_total=219.86MB sample#memory_rss=207.62MB sample#memory_cache=1.69MB sample#memory_swap=10.55MB sample#memory_pgpgin=1590231pages sample#memory_pgpgout=1536648pages sample#memory_quota=512.00MB";

		const currentTime = new Date();

		const expectedParams = {
			MetricData: [
				{
					MetricName: "Memory PGPGIN",
					Dimensions: [{ Name: "Source", Value: "web.1" }],
					Timestamp: currentTime,
					Unit: "Megabytes",
					Value: 1590231,
				},
				{
					MetricName: "Memory PGPGOUT",
					Dimensions: [{ Name: "Source", Value: "web.1" }],
					Timestamp: currentTime,
					Unit: "Megabytes",
					Value: 1536648,
				},
				{
					MetricName: "Memory Usage",
					Dimensions: [{ Name: "Source", Value: "web.1" }],
					Timestamp: currentTime,
					Unit: "Megabytes",
					Value: 219.86,
				},
				{
					MetricName: "Memory RSS",
					Dimensions: [{ Name: "Source", Value: "web.1" }],
					Timestamp: currentTime,
					Unit: "Megabytes",
					Value: 207.62,
				},
				{
					MetricName: "Memory Cache",
					Dimensions: [{ Name: "Source", Value: "web.1" }],
					Timestamp: currentTime,
					Unit: "Megabytes",
					Value: 1.69,
				},
				{
					MetricName: "Memory Swap",
					Dimensions: [{ Name: "Source", Value: "web.1" }],
					Timestamp: currentTime,
					Unit: "Megabytes",
					Value: 10.55,
				},
				{
					MetricName: "Memory Qouta",
					Dimensions: [{ Name: "Source", Value: "web.1" }],
					Timestamp: currentTime,
					Unit: "Megabytes",
					Value: 512,
				},
			],
			Namespace: "Heroku Metrics",
		};

		const CloudWatchMock = {
			putMetricData: function(params) {
				assert.deepEqual(params, expectedParams);
				return {
					promise: () => done(),
				};
			},
		};

		parseMetrics.parseMemoryMetrics(line, CloudWatchMock, currentTime);
	});

	it("should be able to parse load metrics and send them to cloudwatch", function(done) {
		const line =
			"source=web.1 dyno=heroku.2808254.d97d0ea7-cf3d-411b-b453-d2943a50b456 sample#load_avg_1m=2.46 sample#load_avg_5m=1.06 sample#load_avg_15m=0.99";

		const currentTime = new Date();

		const expectedParams = {
			MetricData: [
				{
					MetricName: "CPU Load 1 minute",
					Dimensions: [{ Name: "Source", Value: "web.1" }],
					Timestamp: currentTime,
					Unit: "Percent",
					Value: 2.46,
				},
				{
					MetricName: "CPU Load 5 minute",
					Dimensions: [{ Name: "Source", Value: "web.1" }],
					Timestamp: currentTime,
					Unit: "Percent",
					Value: 1.06,
				},
				{
					MetricName: "CPU Load 15 minute",
					Dimensions: [{ Name: "Source", Value: "web.1" }],
					Timestamp: currentTime,
					Unit: "Percent",
					Value: 0.99,
				},
			],
			Namespace: "Heroku Metrics",
		};

		const CloudWatchMock = {
			putMetricData: function(params) {
				assert.deepEqual(params, expectedParams);
				return {
					promise: () => done(),
				};
			},
		};

		parseMetrics.parseLoadMetrics(line, CloudWatchMock, currentTime);
	});
});

//
