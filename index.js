'use strict';

const fs = require('fs');
const https = require('https');
const path = require('path');
const urllist = require('./urllist');

const RECOVERABLE_ERRORS = 'ECONNRESET,EPROTO,ETIMEDOUT'
const RESULTS_DIR = 'results';

const options = {
  resultsFile: process.argv[2],
  inputList: process.argv[3],
  diffsOnly: process.argv[4] || false
}

const httpOptions = {
  protocol: 'https:',
  host: 'developer.mozilla.org',
  path: ''
}

const handle = getOutputFile(options.resultsFile);
const list = new urllist.URLList(options.inputList, options.diffsOnly);
do {
  let test = list.get();
  httpOptions.path = test.url;
  const req = https.get(httpOptions);
  req.end();
  req.once('response', res => {
    if (res.statusCode.toString().match(/4\d\d/)!==null) {
      let pathString = path.join(httpOptions.host, test.url);
      let record = httpOptions.protocol + "//" + pathString + "\n";
      fs.write(handle, record, () => {
        console.log(record);
      })
    }
    else if (res.statusCode.toString().match(/5\d\d/)!=null) {
      test.retry--;
      list.put(test);
    }
    // Free the memory used by res data.
    res.resume();
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

function getOutputFile(fileName) {
  const outPath = path.join(RESULTS_DIR, fileName);
  if (fs.existsSync(outPath)) {
    fs.unlinkSync(outPath);
  }
  return fs.openSync(outPath, 'w');
}
