'use strict';

var http = require('cheerio-httpcli');

const BARGAINS = {
  shop: '文化堂 戸越銀座店',
  url: 'https://cookpad.com/bargains/%E6%96%87%E5%8C%96%E5%A0%82/4114',
};

class Cookpad {
  // 特売情報を取得する
  static bargains(bargains) {
    bargains = bargains || BARGAINS;
    return new Promise((resolve, reject) => {
      http.fetch(bargains.url, (err, $, res, body) => {
        if ( err ) { return reject(err); }
        var items = $('.product .name a').map((i, el) => $(el).text()).get();
        resolve( Object.assign({ items }, bargains) );
      });
    })
  }
}

module.exports = Cookpad;
