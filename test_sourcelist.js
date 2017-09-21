'use strict';

const sl = require('./sourcelist');
const TEST_FILE = 'in/confluence-test.csv';

function _ReadFile(excludeMatching = false) {
  const list = new sl.ConfluenceSourceList(TEST_FILE, line => {
    console.log(line);
  }, excludeMatching);
}

function ListAll() {
  console.log('\n[WALKER TEST] Starting ConfluenceSourceList with ' + TEST_FILE + '.');
  _ReadFile();
}

function ExcludeMatching() {
  console.log('\n[WALKER TEST] Starting ConfluenceSourceList with ' + TEST_FILE +
              ', excluding unchanged APIs.');
  _ReadFile(true);
}

ExcludeMatching();
ListAll();
