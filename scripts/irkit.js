// Description:
//   IRKit 関連

var irkit = require('../lib/irkit');

module.exports = function(robot) {

  var sendIR = function(msg, command, successMsg) {
    irkit.messages(
      command,
      function() { msg.send( successMsg ); },      // onSuccess
      function(errorMsg) { msg.send( errorMsg ); } // onError
    );
  };

  robot.respond(/テレビ(点|つ)けて/i, function(msg) {
    sendIR(msg, 'tv_power', 'テレビをつけましたよ');
  });

  robot.respond(/テレビ(消|け)して/i, function(msg) {
    sendIR(msg, 'tv_power', 'テレビを消しましたよ');
  });

};
