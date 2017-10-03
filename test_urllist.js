'use strict';

const assert = require('assert');
const urllist = require('./urllist');

const TEST_FILE = 'testfiles/small-test.csv';

function _testSetup(options) {
  return new urllist.URLList(TEST_FILE, options.excludeMatching);
}

function countAll() {
  const options = { excludeMatching: false };
  const list = _testSetup(options);
  assert.equal(list.length(), 16);
}

function countChanges() {
  const options = { excludeMatching: true };
  const list = _testSetup(options);
  assert.equal(list.length(), 6);
}

function testCyclingAll() {
  const options = { excludeMatching: false };
  const list = _testSetup(options);
  const testString = '/en-US/docs/Web/API/AnalyserNode';
  let next;
  let index = 3;
  do {
    next = list.get();
    if (next.url == testString) {
      assert.equal(next.retry, index);
      index--
    }
    next.retry--;
    if (next.retry > 0) {
      list.put(next);
    }
  } while (list.length() > 0);
}

function testCyclingExclude() {
  const options = { excludeMatching: true };
  const list = _testSetup(options);
  const testString = '/en-US/docs/Web/API/AnalyserNode';
  let next;
  let index = 3;
  do {
    next = list.get();
    if (next.url == testString) {
      assert.equal(next.retry, index);
      index--;
    }
    next.retry--
    if (next.retry > 0) {
      list.put(next);
    }
  } while (list.length() > 0);
}

countAll();
countChanges();
testCyclingAll();
testCyclingExclude();
