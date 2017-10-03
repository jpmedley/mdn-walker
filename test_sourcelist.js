'use strict';

const assert = require('assert');
const sl = require('./sourcelist');
const TEST_FILE = 'testfiles/small-test.csv';
// const TEST_FILE = 'in/chrome59-60.csv';
const MALFORMED_TEST_FILE = 'testfiles/malformed-test.csv';

function _testSetup(fileName = TEST_FILE) {
  if (!fileName) { fileName = TEST_FILE};
  return new sl.ConfluenceSourceList(fileName);
}

function _runTests(value) {
  if (!value.includes(',')) { return false; }
  let values = value.split(',');
  if (values.length !== 4) { return false; }
  if (!'truefalse'.includes(values[2])) { return false; }
  if (!'truefalse'.includes(values[3])) { return false; }
  return true;
}

function countAll() {
  let next;
  let count = 0;
  const list = _testSetup();
  do {
    next = list.get(false);
    count++;
  } while (list.length() > 0);
  assert.equal(count, 13);
}

function countChanges() {
  let next;
  let count = 0;
  const list = _testSetup();
  do {
    next = list.get(true);
    count++;
  } while (list.length() > 0);
  assert.equal(count, 4);
}

function listAll() {
  let next;
  const list = _testSetup();
  do {
    next = list.get(false);
    assert.ok(_runTests(next));
  } while (list.length() > 0);
}

function testFormedness() {
  let next;
  const list = _testSetup(MALFORMED_TEST_FILE);
  do {
    next = list.get(false);
    assert.deepStrictEqual(_runTests(next), false);
  } while (list.length() > 0);
}

countAll();
countChanges();
listAll();
testFormedness();
