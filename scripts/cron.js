// Description:
//   指定した時間になったらつぶやく系

var cron = require('../lib/cron');
var getWeather = require('../lib/weather');
var date2sekki = require('../lib/date2sekki');

var options = { room: '#general' };

module.exports = function(robot) {

  cron('0 30 6 * * 1-5', function() {
    robot.send(options, '朝ですよ');
  });

  // 今日の天気
  cron('0 30 6 * * *', function() {
    getWeather(function(text, emoji) {
      robot.send(options, "今日の天気は " + emoji + " です");
      if ( text.match(/雨/) ) {
        robot.send(options, "傘を忘れないでください" );
      }
    });
  });

  // ごみの日通知
  // TODO 不燃ごみの日
  cron('5 30 6 * * 3', function() { robot.send(options, '可燃ごみの日です'); });
  cron('5 30 6 * * 6', function() { robot.send(options, '可燃ごみの日です'); });
  cron('5 30 6 * * 5', function() { robot.send(options, '資源ごみの日です'); });

  // 二十四節気の日だったらつぶやく
  cron('10 30 6 * * 1-5', function() {
    var sekki = date2sekki( new Date() );
    if ( sekki ) {
      robot.send(options, "本日は " + sekki[0] + " です");
      robot.send(options, sekki[1] + "〜");
    }
  });

  cron('0 0 19 * * 1-5', function() {
    robot.send(options, '19時ですよ');
  });

  // 平日前夜(日〜木) 22:00 に「ていうかもう寝よう」画像を貼る
  cron('0 0 22 * * 1-4', function() {
    robot.send(options, 'https://pbs.twimg.com/media/CHqc3UmUwAAwU4K.jpg');
  });

};
