'use strict';

const assert = require('assert');
const redirects = require('./redirects');

const rd = new redirects.Redirects();
const MSG = "redirects.get() does not work as intended."

function test_get() {
  let givenUrl, expectedRedirect
  givenUrl = '/docs/Web/API/Window/Date';
  expectedRedirect = '/docs/Web/JavaScript/Reference/Global_Objects/Date';
  assert.equal(rd.get(givenUrl), expectedRedirect, MSG);

  givenUrl = '/docs/Web/API/Window/Date/now';
  expectedRedirect = '/docs/Web/JavaScript/Reference/Global_Objects/Date/now';
  assert.equal(rd.get(givenUrl), expectedRedirect, MSG);
}

function test_missing() {
  const missingUrl = '/docs/Web/API/Window/Snoopy';
  assert.equal(rd.get(missingUrl), undefined, MSG)
}

test_get();
test_missing();
