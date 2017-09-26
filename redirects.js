'use strict';

const es = require('event-stream');
const fs = require('fs');

function Redirects() {
  let contents = fs.readFileSync('redirects.med', 'utf8');
  let contentsArray = contents.split('\n');
  let me = this;
  this.redirects = new Object();
  contentsArray.forEach((item, i, items) => {
    let oneAndTwo = item.split(';');
    me.redirects[oneAndTwo[0]] = oneAndTwo[1];
  })
}

Redirects.prototype.get = function(find) {
  return this.redirects[find];
}

exports.Redirects = Redirects;
