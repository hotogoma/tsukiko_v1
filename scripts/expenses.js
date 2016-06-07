// Description:
//   家計
// Commands:
//   hubot 支出 - 先月の支出を表示
'use strict';

let expenses = require('../lib/expenses');
let cron = require('../lib/cron');
let sprintf = require('sprintf');

function diffVal(v1, v2) {
  let diff = parseInt(v1) - parseInt(v2);
  let flag = diff == 0 ? '±' : diff > 0 ? '+' : '';
  return flag + diff;
}

function report2fields(all, thisMonth, lastMonth) {
  var fields = [];

  ['電気', '水道', 'ガス', 'ネット', '携帯', 'AWS'].map(function(type) {
    if ( ! thisMonth[type] ) { return; }
    let diff = lastMonth[type] ? diffVal(thisMonth[type].sum, lastMonth[type].sum) : '-';
    let avg = all[type] ? diffVal(thisMonth[type].sum, all[type].average) : '-';
    fields.push({
      title: `${type} ${thisMonth[type].sum} 円`,
      value: [ `前月 ${diff} 円`, `平均 ${avg} 円` ].join("\n"),
      short: true,
    });
  });

  ['Suica', 'イベント', 'その他'].map(function(type) {
    if ( ! thisMonth[type] ) { return; }
    let diff = diffVal(thisMonth[type].sum, lastMonth[type] ? lastMonth[type].sum : 0);
    fields.push({
      title: `${type} ${thisMonth[type].sum} 円`,
      value: `前月 ${diff} 円`,
      short: true,
    });
  });

  fields.push({
    title: `合計 ${thisMonth.total} 円 (家賃含む)`,
    value: `前月 ${diffVal(thisMonth.total, lastMonth.total)} 円`,
    short: false,
  });

  return fields;
}

module.exports = (robot) => {
  if ( ! expenses.enable() ) { return; }

  robot.respond(/支出/i, (msg) => {
    expenses.getReport((err, all, thisMonth, lastMonth) => {
      if (err) {
        msg.send('支出情報の参照に失敗しましたよ');
        return;
      }

      robot.emit('slack.attachment', {
        message: msg.message,
        content: [
          {
            pretext: '先月の支出まとめです',
            fields: report2fields(all, thisMonth, lastMonth),
          },
        ],
      });

    });
  });

  // 毎月 10 日に支出入力の催促
  cron('0 0 19 10 * *', () => {
    robot.send({ room: process.env.SLACK_MAIN_CHANNEL, user: { name: 'hoto' } }, '先月の支出を入力してくださいね');
  });

};
