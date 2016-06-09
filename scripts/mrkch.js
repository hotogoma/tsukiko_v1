// Description:
//   自宅のメトリクス取得
// Commands:
//  hubot (室温|気温|温度) - 現在の室温を取得
'use strict';

let mrkch = require('../lib/mrkch');

const options = { room: process.env.SLACK_MAIN_CHANNEL };

module.exports = (robot) => {

  robot.respond(/(室温|気温|温度)$/i, (msg) => {
    mrkch().then((data) => {
      var temp = Math.round( data.temperature.celsius * 10 ) / 10;
      msg.send(`現在の室温は ${temp} ℃です`);
    });
  });

};
