// Description:
//   指定した時間になったらつぶやく系
'use strict';

let cron = require('../lib/cron');
let getWeather = require('../lib/weather');
let date2sekki = require('../lib/date2sekki');

const options = { room: process.env.SLACK_MAIN_CHANNEL };

module.exports = (robot) => {

  cron('0 30 6 * * 1-5', () => robot.send(options, '朝ですよ'));

  // 今日の天気
  cron('0 30 6 * * *', () => {
    getWeather((text, emoji) => {
      robot.send(options, "今日の天気は " + emoji + " です");
      if ( text.match(/雨/) ) {
        robot.send(options, "傘を忘れないでください" );
      }
    });
  });

  // ごみの日通知
  // TODO 不燃ごみの日
  cron('5 30 6 * * 3', () => robot.send(options, '可燃ごみの日です'));
  cron('5 30 6 * * 6', () => robot.send(options, '可燃ごみの日です'));
  cron('5 30 6 * * 5', () => robot.send(options, '資源ごみの日です'));

  // 二十四節気の日だったらつぶやく
  cron('10 30 6 * * 1-5', () => {
    let sekki = date2sekki( new Date() );
    if ( sekki ) {
      robot.send(options, "本日は " + sekki[0] + " です");
      robot.send(options, sekki[1] + "〜");
    }
  });

  cron('0 0 19 * * 1-5', () => robot.send(options, '19時ですよ'));
};
