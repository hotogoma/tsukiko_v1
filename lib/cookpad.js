'use strict';

var http = require('cheerio-httpcli');

class Cookpad {
  // 特売情報を取得する
  static bargains(url) {
    return new Promise((resolve, reject) => {
      http.fetch(url, (err, $, res, body) => {
        if ( err ) { return reject(err); }
        var items = $('.product .name a').map((i, el) => $(el).text()).get();
        resolve(items);
      });
    })
  }
}

module.exports = Cookpad;
