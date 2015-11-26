// Description:
//   突然の死
'use strict';

let SuddenDeath = require('sudden-death');

module.exports = (robot) => {

  robot.hear(/^突然の(.*)$/, (msg) => {
    msg.send( new SuddenDeath( msg.match[1] ).say() );
  });

};
