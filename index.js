'use strict';

const fs = require('fs');
const https = require('https');
const path = require('path');
const pinger = require('./pinger');
const redirects = require('./redirects');
const urllist = require('./urllist');

const RESULTS_DIR = 'results'

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
const reds = new redirects.Redirects();

newTest();

function newTest() {
  if (list.length()) {
    let urlObj = list.get();
    urlObj.url = reds.get(urlObj.url) || urlObj.url;
    try {
      pngr.ping(urlObj);
    } catch (e) {
      console.log(e);
    }
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
  console.log(outPath);
  if (fs.existsSync(outPath)) {
    fs.unlinkSync(outPath);
  }
  if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR);
  }
  return fs.openSync(outPath, 'w');
}
