// 指定した時間になったらつぶやく系

var cron = require('../lib/cron');
var getWeather = require('../lib/weather');
var date2sekki = require('../lib/date2sekki');

module.exports = function(robot) {

  cron('0 30 6 * * 1-5', function() {
    robot.send({ room: '#general' }, '朝ですよ');
  });

  // 今日の天気
  cron('0 30 6 * * *', function() {
    getWeather(function(text, emoji) {
      robot.send({ room: '#general' }, "今日の天気は " + emoji + " です");
      if ( text.match(/雨/) ) {
        robot.send({ room: '#general' }, "傘を忘れないでください" );
      }
    });
  });

  // ごみの日通知
  cron('5 30 6 * * 3', function() {
    robot.send({ room: '#general' }, '可燃ごみの日です');
  });
  cron('5 30 6 * * 6', function() {
    robot.send({ room: '#general' }, '可燃ごみの日です');
  });
  cron('5 30 6 * * 5', function() {
    robot.send({ room: '#general' }, '資源ごみの日です');
  });

  // 二十四節気の日だったらつぶやく
  cron('10 30 6 * * 1-5', function() {
    var sekki = date2sekki( new Date() );
    if ( sekki ) {
      robot.send({ room: '#general' }, "本日は " + sekki[0] + " です");
      robot.send({ room: '#general' }, sekki[1] + "〜");
    }
  });

  cron('0 0 19 * * 1-5', function() {
    robot.send({ room: '#general' }, '19時ですよ');
  });

  // 平日前夜(日〜木) 22:00 に「ていうかもう寝よう」画像を貼る
  cron('0 0 22 * * 1-4', function() {
    robot.send({ room: '#general' }, 'https://pbs.twimg.com/media/CHqc3UmUwAAwU4K.jpg');
  });

};
