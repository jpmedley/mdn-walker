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
  const me = this;
  function returnLine(){
    let line = SourceList.prototype.get.call(me);
    let props = line.split(',');
    if (diffs_only) {
      if ((props[2]!=props[3]) && (props[3]=='true')) {
        return line
      }
      else {
        return returnLine();
      }
    }
    else {
      return line;
    }
  }
  return returnLine();
}

ConfluenceSourceList.prototype.constructor = ConfluenceSourceList;

exports.ConfluenceSourceList = ConfluenceSourceList;
exports.SourceList = SourceList;
