'use strict';

const es = require('event-stream');
const fs = require('fs');

//Based on: https://stackoverflow.com/questions/16010915/parsing-huge-logfiles-in-node-js-read-in-line-by-line
function SourceList(source) {
  this.source = source;
}

SourceList.prototype.get = function(callback) {
  const source = fs.createReadStream(this.source)
  .pipe(es.split())
  .pipe(es.mapSync(line => {
    if (line.indexOf('Interface') > -1) { return; }
    if (line.length == 0) { return; }
    source.pause();
    callback(line);
    source.resume();
  }))
  .on('error', e => {
    console.log('[WALKER ERR] ', e);
  })
  .on('end', () => {
    console.log('[WALKER] Finished reading list.');
  });
}

function ConfluenceSourceList(source) {
  SourceList.call(this, source);
}

ConfluenceSourceList.prototype.get = function(callback, diffs_only=false) {
  SourceList.prototype.get.call(this, line => {
    let props = line.split(',');
    if (diffs_only) {
      if ((props[2]!=props[3]) && (props[3]=='true')) {
        callback(line);
        return;
      }
    } else {
      callback(line);
    }
  }, diffs_only);
}

// ConfluenceSourceList.prototype = Object.create(SourceList.prototype);
ConfluenceSourceList.prototype.constructor = ConfluenceSourceList;

exports.ConfluenceSourceList = ConfluenceSourceList;
exports.SourceList = SourceList;
