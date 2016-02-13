/**
 * 明日の天気と気温を取得する
 */
'use strict';

let request = new require('request');
let parser = new require('xml2js');

const weatherApiUrl = 'http://rss.weather.yahoo.co.jp/rss/days/4410.xml';

const replaceEmoji = [
  [ /晴れ?/, ':sunny:'     ],
  [ /曇り?/, ':cloud:'     ],
  [ /雨/,    ':umbrella:'  ],
  [ /雪/,    ':snowflake:' ],
  [ /時々/,  '/'           ],
  [ /後/,    '→'          ],
];

// '晴れ - 4℃/-1℃' → { weather: '晴れ', max: 4, min: -1 }
function parseWeather(str) {
  let match = str.match(/^(.+) - (-?\d+)℃\/(-?\d+)℃$/);
  return {
    weather: match[1],
    max: parseInt( match[2] ),
    min: parseInt( match[3] ),
  };
}

function formatWeather(w) {
  let diff = [ w.diffMax, w.diffMin ].map((d) => ( d == 0 ) ? ( '±' + d ) : ( d > 0 ) ? ( '+' + d ) : ( '' + d ));
  return `${w.emoji} ${w.max}℃/${w.min}℃ (前日比${diff[0]}℃/${diff[1]}℃)`;
}

module.exports = function() {
  return new Promise((resolve, reject) => {
    request(weatherApiUrl, (err, response, body) => {
      if ( err ) { return reject(err); }
      parser.parseString(body, (err, res) => {
        if ( err ) { return reject(err); }
        let item = res.rss.channel[0].item;
        let today    = parseWeather( item[0].description[0] );
        let tomorrow = parseWeather( item[1].description[0] );
        tomorrow.diffMax = tomorrow.max - today.max;
        tomorrow.diffMin = tomorrow.min - today.min;
        tomorrow.emoji = replaceEmoji.reduce((w, e) => w.replace.apply(w, e), tomorrow.weather);
        tomorrow.description = formatWeather(tomorrow);
        resolve(tomorrow);
      });
    });
  });
};
