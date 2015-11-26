'use strict';

let request = new require('request');
let parser = new require('xml2js');

const weatherApiUrl = 'http://rss.weather.yahoo.co.jp/rss/days/4410.xml';

const emoji = {
  from: [/晴れ?/, /曇り?/, /雨/, /雪/, /時々/, /後/],
  to: [':sunny:', ':cloud:', ':umbrella:', ':snowflake:', '/', '→'],
};

module.exports = (callback) => {

  request(weatherApiUrl, (error, response, body) => {
    parser.parseString(body, (err, result) => {
      let info = result.rss.channel[0].item[0].description[0].replace(/- /, '');
      let emojiInfo = info;
      for ( let i = 0; i < emoji.from.length; i++ ) {
        emojiInfo = emojiInfo.replace(emoji.from[i], emoji.to[i], 'g');
      }
      if ( callback ) {
        callback(info, emojiInfo);
      }
    });
  });

};
