'use strict';

const path = require('path');
const querystring = require('querystring');
const sl = require('./sourcelist');
const URL_BASE = '/en-US/docs/Web/API';
const RETRY_COUNT = 3;

function URLList(source, diffsOnly=false) {
  this.list = new Array();
  this.length = () => { return this.list.length; }
  let csl = new sl.ConfluenceSourceList(source, diffsOnly);
  let interfaceName;
  do {
    let url;
    let line = csl.get();
    let props = line.split(',');
    props[0] = props[0].slice(1).slice(0, -1);
    props[0] = props[0].replace(/\s/g, '_')
    props = props[0].split('#')
    if (props[0]!=interfaceName) {
      // interfaceName = props[0];
      interfaceName = querystring.escape(props[0]);
      url = path.join(URL_BASE, interfaceName);
      let urlEntry = { url: url, retry: RETRY_COUNT }
      this.list.push(urlEntry)
    }
    url = path.join(URL_BASE, props[0], props[1]);
    let urlEntry = { url: url, retry: RETRY_COUNT }
    this.list.push(urlEntry)
  } while (csl.length() > 0);
}

URLList.prototype.get = function() {
  return this.list.shift();
}

URLList.prototype.put = function(urlEntry) {
  this.list.push(urlEntry);
}

exports.URLList = URLList;
