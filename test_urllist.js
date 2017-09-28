'use strict';

const assert = require('assert');
const urllist = require('./urllist');

const TEST_FILE = 'in/confluence-test.csv';

function _TestSetup(options) {
  return new urllist.URLList(TEST_FILE, options.excludeMatching);
}

function ListAll() {
  let next;
  const options = {excludeMatching: false};
  const list = _TestSetup(options);
  do {
    next = list.next();
    // assert.assert(next.value, 'It worked.');
  } while (next.done == false);
}

// function _ReadURLList(excludeMatching = false) {
//   list.get(line => {
//     console.log(line);
//   }, excludeMatching)
// }
//
// function ListAll() {
//   console.log('\n[WALKER TEST] Starting URLList with ' + TEST_FILE + '.');
//   _ReadURLList();
// }
//
// function ExcludeMatching() {
//   console.log('\n[WALKER TEST] Starting URLList with ' + TEST_FILE +
//               ', excluding unchanged APIs.');
//   _ReadURLList(true);
// }

// ExcludeMatching();
ListAll();
