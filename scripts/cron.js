// Description:
//   指定した時間になったらつぶやく系
'use strict';

let sprintf = require('sprintf');
let cron = require('../lib/cron');
let getWeather = require('../lib/weather');
let date2sekki = require('../lib/date2sekki');

const options = { room: process.env.SLACK_MAIN_CHANNEL };

module.exports = (robot) => {

  // 毎朝
  cron(`0 0 7 * * *`, () => {
    let today = new Date();

    robot.send(options, '朝ですよ');

    let dateStr = sprintf('%02d月%02d日(%s) です',
      today.getMonth() + 1,
      today.getDate(),
      '日月火水木金土'.charAt( today.getDay() )
    );
    robot.send(options, dateStr);

    // 二十四節気の日だったらつぶやく
    let sekki = date2sekki( today );
    if ( sekki ) {
      robot.send(options, `本日は ${sekki[0]} です`);
      robot.send(options, sekki[1] + '〜');
    }

    // ごみの日
    switch ( today.getDay() ) {
      case 3: // 水曜
      case 6: // 土曜
        robot.send(options, '今日は :fire: 可燃ごみ の日です');
        break;
      case 5: // 金曜
        robot.send(options, '今日は :recycle: 資源ごみ の日です');
        break;
      case 2: // 第１・第３火曜
        let n = Math.floor( ( today.getDate() - 1 ) / 7 ) + 1;
        if ( n === 1 || n === 3 ) {
          robot.send(options, '今日は :battery: 不燃ごみ の日です');
        }
        break;
    }

    // 今日の天気
    getWeather((text, emoji) => {
      robot.send(options, `今日の天気は ${emoji} です`);
      if ( text.match(/雨/) ) {
        robot.send(options, '傘を忘れないでください');
      }
    });

  });

  // 平日夜
  cron('0 0 19 * * 1-5', () => robot.send(options, '19時ですよ'));

};
