'use strict';

const assert = require('assert');
const redirects = require('./redirects');

const rd = new redirects.Redirects();

function test_get() {
  let givenUrl, expectedRedirect
  givenUrl = '/docs/Web/API/Window/Date';
  expectedRedirect = '/docs/Web/JavaScript/Reference/Global_Objects/Date';
  const msg = "redirects.get() does not work as intended."
  assert.equal(rd.get(givenUrl), expectedRedirect, msg);

  givenUrl = '/docs/Web/API/Window/Date/now';
  expectedRedirect = '/docs/Web/JavaScript/Reference/Global_Objects/Date/now';
  assert.equal(rd.get(givenUrl), expectedRedirect, msg);
}

function test_missing() {
  const missingUrl = '/docs/Web/API/Window/Snoopy';
  const msg = "redirects.missing() does not work as intended."
  assert.equal(rd.get(missingUrl), undefined, msg)
}

test_get();
test_missing();
