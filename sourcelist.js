'use strict';

const es = require('event-stream');
const fs = require('fs');

function ConfluenceSourceList(source, diffs_only=false) {
  this.differencesOnly = diffs_only;
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

ConfluenceSourceList.prototype.get = function() {
  let line;
  do {
    line = this.lines.shift();
    if (this.differencesOnly) {
      if (line.includes('false,true')) {
        return line;
      }
    }
    else if (!this.differencesOnly) {
      return line;
    }
  } while (this.length() > 0);
}

ConfluenceSourceList.prototype.constructor = ConfluenceSourceList;

exports.ConfluenceSourceList = ConfluenceSourceList;
