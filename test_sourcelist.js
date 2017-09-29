'use strict';

const assert = require('assert');
const sl = require('./sourcelist');
const TEST_FILE = 'in/confluence-test.csv';

function _TestSetup() {
  return new sl.ConfluenceSourceList(TEST_FILE);
}

function _RunTests(value) {
  if (!value.includes(',')) { return false; }
  let values = value.split(',');
  if (!values.length == 4) { return false; }
  if (!'truefalse'.includes(values[2])) { return false; }
  if (!'truefalse'.includes(values[3])) { return false; }
  return true;
}

function ListAll() {
  let next;
  const list = _TestSetup();
  do {
    next = list.get(false);
    assert.ok(_RunTests(next));
  } while (list.length() > 0);
}

function ExcludeMatching() {
  let next;
  const list = _TestSetup();
  do {
    next = list.get(true);
    assert.ok(_RunTests(next));
  } while (list.length() > 0);
}

ExcludeMatching();
// ListAll();
