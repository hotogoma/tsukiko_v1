'use strict';

var http = require('cheerio-httpcli');

class Cookpad {
  // 特売情報を取得する
  static bargains(url) {
    return new Promise((resolve, reject) => {
      http.fetch(url, (err, $, res, body) => {
        if ( err ) { return reject(err); }
        var items = $('.product').map((i, item) => {
          return {
            name: $(item).find('.name a').text(),
            price: $(item).find('.price_and_label .number').text(),
          };
        });
        resolve(items.get().filter((i) => !!i.name));
      });
    })
  }
}

module.exports = Cookpad;
