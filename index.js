'use strict';

const fs = require('fs');
const https = require('https');
const path = require('path');
const urllist = require('./urllist');

const RESULTS = 'dif-results.csv';
const inputList = 'in/chrome59-60.csv';
const options = {
  protocol: 'https:',
  host: 'developer.mozilla.org',
  path: ''
}

let handle;
if (fs.existsSync(RESULTS)) {
  fs.unlinkSync(RESULTS);
}
fs.open(RESULTS, 'w', (e, fd) => {
  if (e) {
    throw e;
  } else {
    handle = fd;
  }
})

const list = new urllist.URLList(inputList, true);
do {
  let test = list.get();
  options.path = test.url;
  const req = https.get(options);
  req.end();
  req.once('response', res => {
    if (res.statusCode.toString().match(/4\d\d/)!==null) {
      let pathString = path.join(options.host, test.url);
      let record = options.protocol + "//" + pathString + "\n";
      fs.write(handle, record, () => {
        console.log(record);
      })
    }
    else if (res.statusCode.toString().match(/5\d\d/)!=null) {
      test.retry--;
      list.put(test);
    }
  })
  .on('error', (e) => {
    if (e.code == 'ECONNRESET') {
      test.retry--;
      list.put(test);
    }
    else if (e.code == 'EPROTO') {
      test.retry--;
      list.put(test);
    }
    else {
      console.log(e.code + ":" + e.message);
    }
  })
} while (list.length() > 0);
