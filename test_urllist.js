'use strict';

const urllist = require('./urllist');

const TEST_FILE = 'in/confluence-test.csv';
const list = new urllist.URLList(TEST_FILE);

function _ReadURLList(excludeMatching = false) {
  list.get(line => {
    console.log(line);
  }, excludeMatching)
}

function ListAll() {
  console.log('\n[WALKER TEST] Starting URLList with ' + TEST_FILE + '.');
  _ReadURLList();
}

function ExcludeMatching() {
  console.log('\n[WALKER TEST] Starting URLList with ' + TEST_FILE +
              ', excluding unchanged APIs.');
  _ReadURLList(true);
}

ExcludeMatching();
ListAll();
