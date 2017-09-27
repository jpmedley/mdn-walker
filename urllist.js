'use strict';

const path = require('path');
const sl = require('./sourcelist');
const URL_BASE = '/en-US/docs/Web/API';

function *URLList(source, diffs_only=false) {
  let source = source;
  let interface;
  this.list = new Array();
  let reader = new sl.ConfluenceSourceList(source);
  reader.get(line => {
    let url;
    let props = line.split(',');
    if (props[0]!=interface) {
      interface = props[0];
      url = path.join(URL_BASE, props[0]);
      this.list.push(url);
    }
    url = path.joing(URL_BASE, props[0], props[1]);
    this.list.push(url);
  }, diffs_only);
  while (this.list.length > 0) {
    let ret = this.list.shift();
    yield ret;
  }
}

// URLList.prototype.get_ = function(callback, diffs_only) {
//   this.list = new sl.ConfluenceSourceList(this.source);
//   this.list.get(line => {
//     let url;
//     const props = line.split(',');
//     if (props[0]!=this.interface){
//       this.interface = props[0];
//       url = path.join(URL_BASE, props[0]);
//       callback(url);
//     }
//     url = path.join(URL_BASE, props[0], props[1]);
//     callback(url);
//   }, diffs_only);
// }

exports.URLList = URLList;
