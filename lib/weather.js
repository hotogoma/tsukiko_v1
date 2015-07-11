var request = new require('request');
var parser = new require('xml2js');
var weatherApiUrl = 'http://rss.weather.yahoo.co.jp/rss/days/4410.xml';

var emoji = {
  from: ['晴れ', '晴', '曇り', '曇', '雨', '雪', '時々', '後'],
  to: ['☀', '☀', '☁', '☁', '☔', '❄', '/', '➔'],
};

module.exports = function(callback) {

  request(weatherApiUrl, function(error, response, body) {
    parser.parseString(body, function(err, result) {
      var info = result.rss.channel[0].item[0].description[0].replace(/- /, '');
      var emojiInfo = info;
      for ( var i=0; i<emoji.from.length; i++ ) {
        emojiInfo = emojiInfo.replace(emoji.from[i], emoji.to[i], 'g');
      }
      if ( callback ) {
        callback(info, emojiInfo);
      }
    });
  });

};
