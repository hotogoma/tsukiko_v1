// Description:
//   家計
'use strict';

let expenses = require('../lib/expenses');
let cron = require('../lib/cron');
let sprintf = require('sprintf');

function diffVal(v1, v2) {
  let diff = parseInt(v1) - parseInt(v2);
  let flag = diff == 0 ? '±' : diff > 0 ? '+' : '';
  return flag + diff;
}

function formatReport(all, thisMonth, lastMonth) {
  let messages = ['先月の支出まとめですよ', ''];

  ['電気', '水道', 'ガス', 'ネット', '携帯', 'AWS'].map(function(type) {
    if ( thisMonth[type] ) {
      let message = sprintf('%s: %s 円 ( 前月 %s 円, 平均 %s 円 )',
        type,
        thisMonth[type].sum,
        lastMonth[type] ? diffVal(thisMonth[type].sum, lastMonth[type].sum) : '-',
        all[type] ? diffVal(thisMonth[type].sum, all[type].average) : '-'
      );
      messages.push( message );
    }
  });

  ['Suica', 'イベント', 'その他'].map(function(type) {
    if ( thisMonth[type] ) {
      let message = sprintf('%s: %s 円 ( 前月 %s 円 )',
        type,
        thisMonth[type].sum,
        diffVal(thisMonth[type].sum, lastMonth[type] ? lastMonth[type].sum : 0)
      );
      messages.push( message );
    }
  });

  messages.push('- - - - - - - - - - - - - - - -');
  let message = sprintf('合計: %s 円 ( 前月 %s 円 ) ※ 家賃・奨学金返済 なども含む',
    thisMonth.total,
    diffVal(thisMonth.total, lastMonth.total)
  );
  messages.push( message );

  return messages;
}

module.exports = (robot) => {
  if ( ! expenses.enable() ) { return; }

  robot.respond(/支出/i, (msg) => {
    expenses.getReport((err, all, thisMonth, lastMonth) => {
      if (err) {
        msg.send('支出情報の参照に失敗しましたよ');
        return;
      }
      let messages = formatReport(all, thisMonth, lastMonth);
      msg.send( messages.join("\n") );
    });
  });

  // 毎月 10 日に支出入力の催促
  cron('0 0 19 10 * *', () => {
    robot.send({ room: process.env.SLACK_MAIN_CHANNEL, user: { name: 'hoto' } }, '先月の支出を入力してくださいね');
  });

};
