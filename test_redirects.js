'use strict';

const assert = require('assert');
const redirects = require('./redirects');

const rd = new redirects.Redirects();

function test_get() {
  let givenUrl, expectedRedirect;
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
  const msg = "redirects.get() does not work as intended.";
  assert.equal(rd.get(missingUrl), undefined, msg)
}

function test_pathContents() {
  const givenUrl = '/en-US/docs/Web/API/Window/Date';
  const expectedRedirect = '/docs/Web/JavaScript/Reference/Global_Objects/Date';
  const msg = "redirects.get() does not correctly remove the language code.";
  assert.equal(rd.get(givenUrl), expectedRedirect, msg);
}

function test_URLTypes() {
  let givenURL, expectedRedirect, msg;
  givenURL = '/docs/Web/API/DOMMatrix/a';
  expectedRedirect = '/docs/Web/API/DOMMatrix';
  msg = "The " + givenURL + "URL does not redirect as intended"
  assert.equal(rd.get(givenURL), expectedRedirect, msg);
}

test_get();
test_missing();
test_pathContents();
test_URLTypes();
