'use strict';

const es = require('event-stream');
const fs = require('fs');

function SourceList(source) {
  let buffer = fs.readFileSync(source)
  this.lines = buffer.toString().split(/\n/);
  this.length = () => { return this.lines.length; }
}

SourceList.prototype.get = function(callback) {
  return this.lines.shift();
}

function ConfluenceSourceList(source) {
  SourceList.call(this, source);
  if (this.lines[0].includes('Interface')) {
    this.lines.shift();
  }
  this.lines = this.lines.filter((line) => {
    return line.includes(',');
  })
}

ConfluenceSourceList.prototype.get = function(diffs_only=false) {
  // const me = this;
  let line;
  if (diffs_only) {
    do {
      line = SourceList.prototype.get.call(this);
      return line
    } while (line.includes('false,true'))
  }
  else {
    return SourceList.prototype.get.call(this);
  }
}

ConfluenceSourceList.prototype.constructor = ConfluenceSourceList;

exports.ConfluenceSourceList = ConfluenceSourceList;
exports.SourceList = SourceList;
