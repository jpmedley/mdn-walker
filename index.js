'use strict';

const https = require('https');
const urllist = require('./urllist');

const inputList = 'in/confluence-test.csv';
const options = {
  protocol: 'https:',
  host: 'developer.mozilla.org',
  path: ''
}

function test(url) {
  options.path = url;
  const req = https.get(options);
  req.end();
  req.once('response', res => {
    console.log(res.statusCode);
  })
}

const list = new urllist.URLList(inputList);
list.get(test);
