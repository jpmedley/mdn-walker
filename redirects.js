'use strict';

const es = require('event-stream');
const find = require('array.prototype.find');
const fs = require('fs');
const path = require('path');

function Redirects(redirectsFile='redirects.med') {
  let contents = fs.readFileSync(redirectsFile, 'utf8');
  let contentsArray = contents.split('\n');
  let me = this;
  this.redirects = new Object();
  contentsArray.forEach((item, i, items) => {
    if (item == '') { return; }
    if (item.startsWith('#')) { return; }
    let paths = item.split(';');
    let lookup = path.parse(paths[0]);
    let redirect = path.parse(paths[1]);
    me.redirects[paths[0]] = paths[1];
  })
}

Redirects.prototype.get = function(find) {
  // Just strip en-US for now.
  if (find.startsWith('/en-US')) {
    find = find.split('/en-US')[1];
  }

  // Check for a literal redirect.
  let result;
  result = this.redirects[find];
  if (typeof result !== 'undefined') {
    return result;
  }

  // Check for a regex redirect.
  let objects = Object.entries(this.redirects);
  let found = objects.find(([key, value]) => {
    if (find.match(key)) { return true; }
    else { return false; }
  });
  // If nothing was found, return that.
  if (found == undefined) { return found; }

  // Check if the returned regex redirect has a keyword.
  const keywordRegex = /\{(\w+)\}/;
  let value = found[1].match(keywordRegex);
  if (value) {
    switch (value[1]) {
      case 'ibid':
        let last = find.substring(find.lastIndexOf('/')+1, find.length);
        found[1] = found[1].replace(value[0], last);
    }
  }

  return found[1];
}

exports.Redirects = Redirects;
