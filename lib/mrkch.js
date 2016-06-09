/**
 * 自宅のメトリクス取得
 */
'use strict';

let request = new require('request');

const API = 'http://api.mrkch.jp/';

module.exports = function() {
  return new Promise((resolve, reject) => {
    request(API, (err, response, body) => {
      if ( err ) { return reject(err); }
      resolve( JSON.parse(body) );
    });
  });
};
