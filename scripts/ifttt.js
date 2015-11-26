// Description:
//   IFTTT
'use strict';

let IFTTT = require('../lib/ifttt');

const options = { room: process.env.SLACK_MAIN_CHANNEL };

module.exports = (robot) => {
  let ifttt = new IFTTT(robot);

  // 退社を通知
  ifttt.on('leftOffice', (data) => {
    let date = new Date();
    // 土日は通知しない
    if ( date.getDay() % 6 === 0 ) { return; }
    // 昼までは通知しない
    if ( date.getHours() < 16 ) { return; }
    robot.send(options, `【 ${data.description} 】ﾀｲｼｬ!!`);
  });

};
