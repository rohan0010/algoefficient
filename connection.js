var elasticsearch=require('elasticsearch');

const client = new elasticsearch.Client({
   hosts: [ 'https://elastic:CNSFer5jD3SO6fRz8iAXnGJU@44d2c83db21f485cb0ff4ff063c37eb4.us-east-1.aws.found.io:9243'],
   requestTimeout: 2147483647
});

module.exports = client;
