function parseMemoryMetrics(line, cloudwatch, __time) {
	// time parameter is used only in test mode
	const currentTime = __time || new Date();

	const [
		content,
		source,
		dyno,
		memoryTotal,
		memoryRss,
		memoryCache,
		memorySwap,
		memoryPgpgin,
		memoryPgpgout,
		memoryQuota,
	] = line.match(
		/source=(\w+[.]\d+) dyno=([^ ]+) sample#memory_total=([^ ]+)MB sample#memory_rss=([^ ]+)MB sample#memory_cache=([^ ]+)MB sample#memory_swap=([^ ]+)MB sample#memory_pgpgin=([^ ]+)pages sample#memory_pgpgout=([^ ]+)pages sample#memory_quota=([^ ]+)MB/
	);

	const params = {
		MetricData: [
			{
				MetricName: "Memory PGPGIN",
				Dimensions: [
					{
						Name: "Source",
						Value: source,
					},
				],
				Timestamp: currentTime,
				Unit: "Megabytes",
				Value: Number(memoryPgpgin),
			},
			{
				MetricName: "Memory PGPGOUT",
				Dimensions: [
					{
						Name: "Source",
						Value: source,
					},
				],
				Timestamp: currentTime,
				Unit: "Megabytes",
				Value: Number(memoryPgpgout),
			},
			{
				MetricName: "Memory Usage",
				Dimensions: [
					{
						Name: "Source",
						Value: source,
					},
				],
				Timestamp: currentTime,
				Unit: "Megabytes",
				Value: Number(memoryTotal),
			},
			{
				MetricName: "Memory RSS",
				Dimensions: [
					{
						Name: "Source",
						Value: source,
					},
				],
				Timestamp: currentTime,
				Unit: "Megabytes",
				Value: Number(memoryRss),
			},
			{
				MetricName: "Memory Cache",
				Dimensions: [
					{
						Name: "Source",
						Value: source,
					},
				],
				Timestamp: currentTime,
				Unit: "Megabytes",
				Value: Number(memoryCache),
			},
			{
				MetricName: "Memory Swap",
				Dimensions: [
					{
						Name: "Source",
						Value: source,
					},
				],
				Timestamp: currentTime,
				Unit: "Megabytes",
				Value: Number(memorySwap),
			},
			{
				MetricName: "Memory Qouta",
				Dimensions: [
					{
						Name: "Source",
						Value: source,
					},
				],
				Timestamp: currentTime,
				Unit: "Megabytes",
				Value: Number(memoryQuota),
			},
		],
		Namespace: "Heroku Metrics",
	};

	return cloudwatch.putMetricData(params).promise();
}

function parseLoadMetrics(line, cloudwatch, __time) {
	// time parameter is used only in test mode
	const currentTime = __time || new Date();

	const [content, source, dyno, load1m, load5m, load15m] = line.match(
		/source=(\w+[.]\d+) dyno=([^ ]+) sample#load_avg_1m=([^ ]+) sample#load_avg_5m=([^ ]+) sample#load_avg_15m=([^ ]+)/
	);

	const params = {
		MetricData: [
			{
				MetricName: "CPU Load 1 minute",
				Dimensions: [
					{
						Name: "Source",
						Value: source,
					},
				],
				Timestamp: currentTime,
				Unit: "Percent",
				Value: Number(load1m),
			},
			{
				MetricName: "CPU Load 5 minute",
				Dimensions: [
					{
						Name: "Source",
						Value: source,
					},
				],
				Timestamp: currentTime,
				Unit: "Percent",
				Value: Number(load5m),
			},
			{
				MetricName: "CPU Load 15 minute",
				Dimensions: [
					{
						Name: "Source",
						Value: source,
					},
				],
				Timestamp: currentTime,
				Unit: "Percent",
				Value: Number(load15m),
			},
		],
		Namespace: "Heroku Metrics",
	};

	return cloudwatch.putMetricData(params).promise();
}

module.exports.parseMemoryMetrics = parseMemoryMetrics;
module.exports.parseLoadMetrics = parseLoadMetrics;
