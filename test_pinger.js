'use strict';

const assert = require('assert');
const pinger = require('./pinger');

const VALID_URL = {
  url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTime',
  retry: 3
}

const INVALID_URL = {
  url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getSpock',
  retry: 3
}

const httpOptions = {
  protocol: 'https:',
  host: 'developer.mozilla.org',
  path: ''
}

// A mock server is needed to completely test Pinger.
// Do the best I can for now.

const pngr = new pinger.Pinger(httpOptions);

pngr.addListener('found', (e) => {
  console.log("Nothing to report.");
});

pngr.addListener('needsretry', (e) => {
  console.log(e);
});

pngr.addListener('missing', (e) => {
  console.log(e);
})

pngr.ping(VALID_URL);
pngr.ping(INVALID_URL);
