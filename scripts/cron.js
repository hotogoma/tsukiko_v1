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

function weather2slackAttachment(weather) {
  var title = '明日の天気は ' + weather.emoji + ' です';
  var attachment = {
    fallback: title,
    title: title,
    fields: [
      { title: '最高気温', value: `${weather.max}℃ (${weather.diffMaxStr}℃)`, short: true },
      { title: '最低気温', value: `${weather.min}℃ (${weather.diffMinStr}℃)`, short: true },
    ],
  };
  if ( weather.weather.match(/雨/) ) {
    attachment.text = '傘を忘れないでください';
    attachment.color = '#439FE0';
  }
  return attachment;
}

module.exports = (robot) => {



  let shukjitz = new Shukjitz();
  let irkit = new IRKit();

  // 毎朝
  cron('0 30 7 * * *', () => {
    var attachment = {
      fallback: '朝ですよ',
      pretext: '朝ですよ',
      fields: [],
    };

    let today = new Date();

    // 日付
    let holiday = shukjitz.checkSync(today);
    attachment.title = sprintf('%02d月%02d日(%s%s)%s',
      today.getMonth() + 1,
      today.getDate(),
      '日月火水木金土'.charAt( today.getDay() ),
      holiday ? '祝' : '',
      holiday ? ` ${holiday}` : ''
    );

    // 二十四節気
    let sekki = date2sekki( today );
    if ( sekki ) {
      attachment.fields.push({ title: sekki[0] + ' (二十四節気)', value: sekki[1] + '〜' });
    }

    robot.emit('slack.attachment', { message: options, content: [ attachment ] });
  });

  // 7時半に照明を点ける / 9時に照明を消す
  if ( irkit.available() ) {
    cron('0 30 7 * * *', () => irkit.send( signals.light.on ));
    cron('0 0 9 * * *', () => irkit.send( signals.light.off ));
  }

  cron('0 0 22 * * *', () => {
    let tomorrow = new Date();
    tomorrow.setDate( tomorrow.getDate() + 1 );

    // ごみの日
    var trash = null;
    switch ( tomorrow.getDay() ) {
      case 3: // 水曜
      case 6: // 土曜
        trash = ':fire: 可燃ごみ';
        break;
      case 5: // 金曜
        trash = ':recycle: 資源ごみ';
        break;
      case 2: // 第１・第３火曜
        let n = Math.floor( ( tomorrow.getDate() - 1 ) / 7 ) + 1;
        if ( n === 1 || n === 3 ) {
          trash = ':battery: 不燃ごみ';
        }
        break;
    }
    if ( trash ) {
      let text = `明日は ${trash} の日です`;
      robot.emit('slack.attachment', {
        message: options,
        content: [{ fallback: text, title: text }],
      });
    }

    // 明日の天気
    getWeather().then((weather) => {
      robot.emit('slack.attachment', {
        message: options,
        content: [ weather2slackAttachment(weather) ],
      });
    });

  });

  // 平日夜
  cron('0 0 19 * * 1-5', () => robot.send(options, '19時ですよ'));

  // 明日の天気 (普通に呼び出す用)
  robot.respond(/天気/, (msg) => {
    getWeather().then((weather) => {
      robot.emit('slack.attachment', {
        message: msg.message,
        content: [ weather2slackAttachment(weather) ],
      });
    });
  });

};
