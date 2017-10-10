'use strict';

const https = require('https');
const extend = require('node.extend');
const events = require('events');

const RECOVERABLE_ERRORS = 'ECONNRESET,EPROTO,ETIMEDOUT';

function Pinger(httpOptions) {
  this.options = httpOptions;
  extend(this, events.EventEmitter.prototype);
}

Pinger.prototype.ping = function(path) {
  this.options.path = path;
  let me = this;
  https.get(this.options, (res) => {
    me.statusCode = res.statusCode;
    if (res.statusCode.toString().match(/4\d\d/)!==null) {
      this.emit('missing', {
        path: path
      });
    }
    else if (res.statusCode.toString().match(/5\d\d/)!=null) {
      this.emit('needsretry', {
        path: path
      });
    }
    res.on('data', (chunk) => {
      res.resume();
    })
    res.on('end', () => {
      if (this.statusCode.toString().match(/2\d\d/)!=null) {
        this.emit('found', {
          path: path
        });
      }
    });
  })
  .on('error', (e) => {
    if (RECOVERABLE_ERRORS.includes(e.code)) {
      this.emit('needsretry', {
        path: path
      })
    }
    else {
      throw e;
    }
  })
}

exports.Pinger = Pinger;