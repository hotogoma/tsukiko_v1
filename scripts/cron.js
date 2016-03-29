// Description:
//   指定した時間になったらつぶやく系
'use strict';

let sprintf = require('sprintf');
let cron = require('../lib/cron');
let getWeather = require('../lib/weather');
let date2sekki = require('../lib/date2sekki');
let Shukjitz = require('shukjitz');
let IRKit = require('irkit');
let signals = require('../config/irkit.json');

const options = { room: process.env.SLACK_MAIN_CHANNEL };

module.exports = (robot) => {

  let shukjitz = new Shukjitz();
  let irkit = new IRKit();

  // 毎朝
  cron('0 0 7 * * *', () => {
    let today = new Date();

    robot.send(options, '朝ですよ');

    let holiday = shukjitz.checkSync(today);
    let dateStr = sprintf('%02d月%02d日(%s%s)%s です',
      today.getMonth() + 1,
      today.getDate(),
      '日月火水木金土'.charAt( today.getDay() ),
      holiday ? '祝' : '',
      holiday ? ` ${holiday}` : ''
    );
    robot.send(options, dateStr);

    // 二十四節気の日だったらつぶやく
    let sekki = date2sekki( today );
    if ( sekki ) {
      robot.send(options, `本日は ${sekki[0]} です`);
      robot.send(options, sekki[1] + '〜');
    }

  });

  // 7時に照明を点ける / 9時に照明を消す
  if ( irkit.available() ) {
    cron('0 0 7 * * *', () => irkit.send( signals.light.on  ));
    cron('0 0 9 * * *', () => irkit.send( signals.light.off ));
  }

  cron('0 0 22 * * *', () => {
    let tomorrow = new Date();
    tomorrow.setDate( tomorrow.getDate() + 1 );

    // ごみの日
    switch ( tomorrow.getDay() ) {
      case 3: // 水曜
      case 6: // 土曜
        robot.send(options, '明日は :fire: 可燃ごみ の日です');
        break;
      case 5: // 金曜
        robot.send(options, '明日は :recycle: 資源ごみ の日です');
        break;
      case 2: // 第１・第３火曜
        let n = Math.floor( ( tomorrow.getDate() - 1 ) / 7 ) + 1;
        if ( n === 1 || n === 3 ) {
          robot.send(options, '明日は :battery: 不燃ごみ の日です');
        }
        break;
    }

    // 明日の天気
    getWeather().then((weather) => {
      robot.send(options, `明日の天気は ${weather.description} です`);
      if ( weather.weather.match(/雨/) ) {
        robot.send(options, '傘を忘れないでください');
      }
    });

  });

  // 平日夜
  cron('0 0 19 * * 1-5', () => robot.send(options, '19時ですよ'));

};
