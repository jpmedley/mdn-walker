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
  //Just strip en-US for now.
  if (find.startsWith('/en-US')) {
    find = find.split('/en-US')[1];
  }

  let result;
  result = this.redirects[find];
  if (result) { return result; }
  // if (typeof result !== undefined) {
  //   return result;
  // }

  let objects = Object.entries(this.redirects);
  let found = objects.find(([key, value]) => {
    if (find.match(key)) { return true; }
    else { return false; }
  });
  if (found == undefined) { return found; }
  return found[1];
}

exports.Redirects = Redirects;
