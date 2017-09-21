'use strict';

const es = require('event-stream');
const fs = require('fs');

//Based on: https://stackoverflow.com/questions/16010915/parsing-huge-logfiles-in-node-js-read-in-line-by-line
function SourceList(source, callback) {
  this.source = source;
}

SourceList.prototype.get = function(processFunction) {
  fs.createReadStream(this.source)
  .pipe(es.split())
  .pipe(es.mapSync(line => {
    processFunction(line);
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

ConfluenceSourceList.prototype.get = function(processFunction, diffs_only=false) {
  SourceList.prototype.get.call(this, line => {
    let props = line.split(',');
    if (diffs_only) {
      if ((props[2]!=props[3]) && (props[3]=='true')) {
        processFunction(line);
        return;
      }
    } else {
      processFunction(line);
    }
  }, diffs_only);
}

// ConfluenceSourceList.prototype = Object.create(SourceList.prototype);
ConfluenceSourceList.prototype.constructor = ConfluenceSourceList;

exports.ConfluenceSourceList = ConfluenceSourceList;
exports.SourceList = SourceList;
