node-heroku-cloudwatch-drain
============

[![Build Status](https://travis-ci.org/deepsyx/node-heroku-cloudwatch-drain.svg?branch=master)](https://travis-ci.org/deepsyx/node-heroku-cloudwatch-drain)
Simple CLI tool that let you pipe all heroku logs to cloudwatch.

Deploying 
===
* Login to AWS console (https://console.aws.amazon.com)
* Create a new EC2 instance (even t2.nano will do the job, it uses 3-4% cpu with 50requests/second). AMI doesn't matter as long as it supports NodeJS
* Create a new AWS user with programic access to CloudWatch (https://console.aws.amazon.com/iam/home?region=us-east-1#/users)
* Create a new security group, allow public access to port `3000` and attach it to your instance
* Login into the freshly created instance and add to `/etc/environment` your `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` keys
* Install NodeJS + NPM
* Install npm depencencies with `npm install -g node-heroku-cloudwatch-drain forever`
* Create a `config.js` file with the following content:


    module.exports = {
        // how many messages should we buffer and send to AWS at once, do not change unless necessary
    	batchSize: 50,
    	
    	// at what port should our server be listening
    	serverPort: 3000,
    	
    	// your cloudwatch log group
    	logGroup: "heroku",
    	
    	// prefix for all stream names (a random number will be appended)
    	logStreamPrefix: "dyno",
    	
    	// we strongly recommend using env variables for the credentials, however you can still add them here
    	awsCredentials: {
    		region: "us-east-1",
    	},
    	
    	// access token, which will be sent from heroku on every request
    	accessToken: "sometoken",
    	
    	// [OPTIONAL] array with regexs to avoid pushing useless logs to cloudwatch
    	filters: [/getVersion/],
    };

* Run the tool with forever (it will auto-restart on failure)
    

      $ forever start -c node-heroku-cloudwatch-drain config.js

* get your EC2 instance IP from the console and try to open the following link in your browser:


    http://ec2-XXX-XXX-XXX-XXX.compute-1.amazonaws.com:3000/
 
and you should see `{"message":"Invalid token"}` as response.

* Now download `heroku cli` to your local machine and login via `heroku login`
* execute


    $ heroku drains:add http://ec2-XXX-XXX-XXX-XXX.compute-1.amazonaws.com:3000/log?accessToken=sometoken --app YOUR APP
    
* If the above command succeed, your heroku logs should start appearing in CloudWatch.

# 1 License

Licensed under the MIT license.
