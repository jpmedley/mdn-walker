'use strict';

const es = require('event-stream');
const fs = require('fs');

function Redirects() {
  this.redirects = 'redirects.med';
}

Redirects.prototype.get = function(find, callback) {
  const source = fs.createReadStream(this.redirects)
  .pipe(es.split())
  .pipe(es.mapSync(line => {
    source.pause();
    let parts = line.split(';');
    if (find==parts[0] {
      callback(parts[1]);
    })
    source.resume();
  }))
  .on('error', e => {
    console.log('[WALKER ERR] ', e);
  });
}
