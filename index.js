'use strict';

const fs = require('fs');
const https = require('https');
const path = require('path');
const urllist = require('./urllist');

const RESULTS = process.argv[2];
const RESULTS_DIR = 'results';
// const RESULTS = 'dif-results.csv';
const RECOVERABLE_ERRORS = 'ECONNRESET,EPROTO,ETIMEDOUT'
const inputList = process.argv[3];
// const inputList = 'in/chrome59-60.csv';
const diffsOnly = process.argv[4] || false;
const options = {
  protocol: 'https:',
  host: 'developer.mozilla.org',
  path: ''
}

let handle;
let outPath = path.join(RESULTS_DIR, RESULTS);
if (fs.existsSync(outPath)) {
  fs.unlinkSync(outPath);
}
fs.open(outPath, 'w', (e, fd) => {
  if (e) {
    throw e;
  } else {
    handle = fd;
  }
})

const list = new urllist.URLList(inputList, diffsOnly);
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
    if (RECOVERABLE_ERRORS.includes(e.code)) {
      test.retry--;
      list.put(test);
    }
    else {
      console.log(e.code + ":" + e.message);
    }
  })
} while (list.length() > 0);
