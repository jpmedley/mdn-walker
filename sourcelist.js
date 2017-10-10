'use strict';

const es = require('event-stream');
const fs = require('fs');

function ConfluenceSourceList(source, diffs_only=false) {
  let buffer = fs.readFileSync(source);
  this.lines = buffer.toString().split(/\n/);
  this.length = () => { return this.lines.length; }
  if (this.lines[0].includes('Interface')) {
    this.lines.shift();
  }
  this.lines = this.lines.filter((line) => {
    return line.includes(',');
  })
  if (diffs_only) {
    this.lines = this.lines.filter((line) => {
      return line.includes('false,true');
    })
  }
}

ConfluenceSourceList.prototype.get = function() {
  return this.lines.shift();
}

ConfluenceSourceList.prototype.constructor = ConfluenceSourceList;

exports.ConfluenceSourceList = ConfluenceSourceList;
