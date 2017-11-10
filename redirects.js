'use strict';

const es = require('event-stream');
const fs = require('fs');
const path = require('path');

function Redirects() {
  let contents = fs.readFileSync('redirects.med', 'utf8');
  let contentsArray = contents.split('\n');
  let me = this;
  this.redirects = new Object();
  contentsArray.forEach((item, i, items) => {
    if (item == '') { return; }
    let paths = item.split(';');
    let lookup = path.parse(paths[0]);
    let redirect = path.parse(paths[1]);
    if (lookup.name == '*') {
      me.redirects[lookup.dir] = redirect.dir;
    }
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
  if (typeof result !== 'undefined') {
    return result;
  }
  let parsed = path.parse(find);
  let newFind = parsed.dir + "/*";
  result = this.redirects[newFind];
  if (typeof result != 'undefined') {
    let parsedResult = path.parse(result);
    result = path.join(parsedResult.dir, parsed.name);
    return result;
  }
  return result;
}

exports.Redirects = Redirects;
