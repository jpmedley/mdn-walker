'use strict';

const fs = require('fs');
const https = require('https');
const path = require('path');
const pinger = require('./pinger');
const urllist = require('./urllist');

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
const pngr = new pinger.Pinger(httpOptions);

newTest();

function newTest() {
  if (list.length()) {
    pngr.ping(list.get());
  }
}

pngr.addListener('needsretry', (entry) => {
  if (entry.retry > 0) {
    entry.retry--;
  }
  list.put(entry);
  newTest();
});

pngr.addListener('missing', (entry) => {
  let pathString = path.join(httpOptions.host, entry.url);
  let record = httpOptions.protocol + "//" + pathString + "\n";
  fs.write(handle, record, () => {
    console.log(record);
  });
  newTest();
})

pngr.addListener('found', () => {
  newTest();
})

function getOutputFile(fileName) {
  const outPath = path.join(RESULTS_DIR, fileName);
  if (fs.existsSync(outPath)) {
    fs.unlinkSync(outPath);
  }
  return fs.openSync(outPath, 'w');
}
