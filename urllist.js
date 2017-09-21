'use strict';

const path = require('path');
const sl = require('./sourcelist');
const URL_BASE = '/en-US/docs/Web/API';

function URLList(source) {
  this.source = source;
  this.interface;
}

URLList.prototype.get = function(callback, diffs_only) {
  this.list = new sl.ConfluenceSourceList(this.source);
  this.list.get(line => {
    let url;
    const props = line.split(',');
    if (props[0]!=this.interface){
      this.interface = props[0];
      url = path.join(URL_BASE, props[0]);
      callback(url);
    }
    url = path.join(URL_BASE, props[0], props[1]);
    callback(url);
  }, diffs_only);
}

exports.URLList = URLList;
