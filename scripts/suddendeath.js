// Description:
//   突然の死

var SuddenDeath = require('sudden-death');

module.exports = function(robot) {

  robot.hear(/^突然の(.*)$/, function(msg) {
    msg.send( new SuddenDeath( msg.match[1] ).say() );
  });

};
