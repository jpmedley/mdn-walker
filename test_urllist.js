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
    next = list.get();
  } while (list.length() > 0);
  assert.ok(true);
}

function ExcludeMatching() {
  let next;
  const options = {excludeMatching: true};
  const list = _TestSetup(options);
  do {
    next = list.get();
  } while (list.length() > 0);
  assert.ok(true);
}

function decrementRetriesAll() {
  let next;
  const options = {excludeMatching: false};
  const list = _TestSetup(options);
  do {
    next = list.get();
    next.retry--;
    if (next.retry > 0) {
      list.put(next);
    }
  } while (list.length() > 0)
  assert.ok(true);
}

function decrementRetriesExclude() {
  let next;
  const options = {excludeMatching: true};
  const list = _TestSetup(options);
  do {
    next = list.get();
    next.retry--;
    if (next.retry > 0) {
      list.put(next);
    }
  } while (list.length() > 0)
  assert.ok(true);
}
ListAll();
ExcludeMatching();
decrementRetriesAll();
decrementRetriesExclude();
