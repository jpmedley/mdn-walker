'use strict';

const es = require('event-stream');
const fs = require('fs');

function ConfluenceSourceList(source) {
    let buffer = fs.readFileSync(source);
    this.lines = buffer.toString().split(/\n/);
    this.length = () => { return this.lines.length; }
  if (this.lines[0].includes('Interface')) {
    this.lines.shift();
  }
  this.lines = this.lines.filter((line) => {
    return line.includes(',');
  })
}

ConfluenceSourceList.prototype.get = function(diffs_only=false) {
  let line;
  do {
    line = this.lines.shift();
    if (diffs_only) {
      if (line.includes('false,true')) {
        return line;
      }
    }
    else if (!diffs_only) {
      return line;
    }
  } while (this.length() > 0);
}

ConfluenceSourceList.prototype.constructor = ConfluenceSourceList;

exports.ConfluenceSourceList = ConfluenceSourceList;
