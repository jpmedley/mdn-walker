'use strict';

const https = require('https');
const extend = require('node.extend');
const events = require('events');

const RECOVERABLE_ERRORS = 'ECONNRESET,EPROTO,ETIMEDOUT';

function Pinger(httpOptions) {
  this.options = httpOptions;
  extend(this, events.EventEmitter.prototype);
}

// let urlEntry = { url: url, retry: RETRY_COUNT }
Pinger.prototype.ping = function(entry) {
  this.options.path = entry.url;
  let me = this;
  https.get(this.options, (res) => {
    me.statusCode = res.statusCode;
    if (res.statusCode.toString().match(/3\d\d/)!=null) {
      this.emit('found');
    }
    else if (res.statusCode.toString().match(/4\d\d/)!==null) {
      this.emit('missing', entry);
    }
    else if (res.statusCode.toString().match(/5\d\d/)!=null) {
      this.emit('needsretry', entry);
    }
    res.on('data', (chunk) => {
      res.resume();
    })
    res.on('end', () => {
      if (this.statusCode.toString().match(/2\d\d/)!=null) {
        this.emit('found');
      }
    })
    res.on('error', (e) => {
      if (RECOVERABLE_ERRORS.includes(e.code)) {
        this.emit('needsretry', entry);
      }
      else {
        throw e;
      }
    })
  })
}

exports.Pinger = Pinger;
