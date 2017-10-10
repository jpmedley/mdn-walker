'use strict';

const assert = require('assert');
const sl = require('./sourcelist');
const TEST_FILE = 'testfiles/small-test.csv';
const BULK_TEST_FILE = 'testfiles/bulk-test.csv';
const MALFORMED_TEST_FILE = 'testfiles/malformed-test.csv';

function _testSetup(options) {
  return new sl.ConfluenceSourceList(options.fileName, options.differencesOnly);
}

function countAll() {
  let next;
  let count = 0;
  const options = { fileName: TEST_FILE, differencesOnly: false };
  const list = _testSetup(options);
  do {
    next = list.get();
    count++;
  } while (list.length() > 0);
  assert.equal(count, 13);
}

function countChanges() {
  // General setup
  let next;
  let count = 0;
  let list;
  const options = { fileName: TEST_FILE, differencesOnly: true };

  // Test differences on small file.
  list = _testSetup(options);
  do {
    next = list.get();
    count++;
  } while (list.length() > 0);
  assert.equal(count, 4);

  // Test differences on big file.
  count = 0;
  options.fileName = BULK_TEST_FILE;
  list = _testSetup(options);
  do {
    next = list.get();
    count++;
  } while (list.length() > 0);
  assert.equal(count, 11);
}

function listAll() {
  let next;
  const options = { fileName: TEST_FILE, differencesOnly: false };
  const list = _testSetup(options);
  do {
    next = list.get();
    assert.ok(_testFormedness(next));
  } while (list.length() > 0);
}

function testFormedness() {
  let next;

  const options = { fileName: MALFORMED_TEST_FILE, differencesOnly: false };
  const list = _testSetup(options);
  do {
    next = list.get();
    assert.deepStrictEqual(_testFormedness(next), false);
  } while (list.length() > 0);
}

function _testFormedness(value) {
  if (!value.includes(',')) { return false; }
  let values = value.split(',');
  if (values.length !== 4) { return false; }
  if (!'truefalse'.includes(values[2])) { return false; }
  if (!'truefalse'.includes(values[3])) { return false; }
  return true;
}

countAll();
countChanges();
listAll();
testFormedness();
