node-heroku-cloudwatch-drain
============

[![Build Status](https://travis-ci.org/deepsyx/node-heroku-cloudwatch-drain.svg?branch=master)](https://travis-ci.org/deepsyx/node-heroku-cloudwatch-drain)
Simple CLI tool that let you pipe all heroku logs to cloudwatch.

# # Installation

Installation is just simple as

    yarn global add node-heroku-cloudwatch-drain
    
or if you're more comfortable with npm:

    npm install -g node-heroku-cloudwatch-drain
    
# # Usage

At this point we don't have a wizard for generating config file on the fly, but you can your own by using the following template:

    module.exports = {
        // how many messages should we buffer and send to AWS at once
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

Save the file above as `config.js` and add `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` to your env variables (also make sure they have the proper AWS permissions).

You can now run the tool with

    $ node-heroku-cloudwatch-drain config.js

# # License

Licensed under the MIT license.