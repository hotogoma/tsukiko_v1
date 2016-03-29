// Description:
//   IRKit 関連
// Commands:
//   hubot テレビ(つけて|消して) - テレビを操作
//   hubot エアコン(つけて|消して) - エアコンを操作
//   hubot 電気(つけて|消して) - 照明を操作

var irkit = require('../lib/irkit');

module.exports = (robot) => {

  function sendIR(msg, command, successMsg) {
    irkit.messages(
      command,
      function() { msg.send( successMsg ); },      // onSuccess
      function(errorMsg) { msg.send( errorMsg ); } // onError
    );
  }

  robot.respond(/テレビ(点|つ)けて/i, (msg) => {
    sendIR(msg, 'tv_power', 'テレビをつけましたよ');
  });

  robot.respond(/テレビ(消|け)して/i, (msg) => {
    sendIR(msg, 'tv_power', 'テレビを消しましたよ');
  });

  robot.respond(/エアコン(点|つ)けて/i, (msg) => {
    sendIR(msg, 'aircon_on', 'エアコンをつけましたよ');
  });

  robot.respond(/エアコン(消|け)して/i, (msg) => {
    sendIR(msg, 'aircon_off', 'エアコンを消しましたよ');
  });

  robot.respond(/Apple\s?TV/i, (msg) => {
    sendIR(msg, 'appletv_select', 'AppleTV をつけましたよ');
  });

  robot.respond(/(電気|照明|ライト)(点|つ)けて/i, (msg) => {
    sendIR(msg, 'light_on', '照明をつけましたよ');
  });

  robot.respond(/(電気|照明|ライト)(消|け)して/i, (msg) => {
    sendIR(msg, 'light_off', '照明を消しましたよ');
  });

};
