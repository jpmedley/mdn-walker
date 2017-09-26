'use strict';

const assert = require('assert');
const redirects = require('./redirects');

const TEST_URL = '/docs/Web/API/Window/Int16Array';
const TEST_REDIRECT = '/docs/Web/JavaScript/Reference/Global_Objects/Int16Array';
const rd = new redirects.Redirects();

function test_get() {
  const msg = "redirects.get() does not work as intended."
  assert.equal(rd.get(TEST_URL), TEST_REDIRECT, msg);
}

test_get();
