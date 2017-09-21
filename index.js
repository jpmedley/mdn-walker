'use strict';

const fs = require('fs');
const https = require('https');
const path = require('path');
const urllist = require('./urllist');

const inputList = 'in/confluence-test.csv';
const options = {
  protocol: 'https:',
  host: 'developer.mozilla.org',
  path: ''
}

let handle;
fs.open('results.csv', 'w', (e, fd) => {
  if (e) {
    if (e.code === 'EEXIST') {
      console.error("[WALKER] File already exists");
      return;
    } else {
      throw e;
    }
  } else {
    handle = fd;
  }
})

function testUrl(url) {
  options.path = url;
  const req = https.get(options);
  req.end();
  req.once('response', res => {
    // console.log(res.statusCode);
    if (res.statusCode >= 300) {
      var link = path.join(options.protocol, options.host, url) + "\n";
      fs.write(handle, link, () => {
        // console.log(arguments[0]);
      });
    }
  })
}

const list = new urllist.URLList(inputList);
list.get(testUrl);
