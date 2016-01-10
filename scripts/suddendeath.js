// Description:
//   突然の死
// Commands:
//   突然の<word> - 突然の死ジェネレータ
'use strict';

let SuddenDeath = require('sudden-death');

module.exports = (robot) => {

  robot.hear(/^突然の(.*)$/, (msg) => {
    msg.send( new SuddenDeath( msg.match[1] ).say() );
  });

};
