// Description:
//   IRKit 関連
// Commands:
//   hubot テレビ(つけて|消して) - テレビを操作
//   hubot エアコン(つけて|消して) - エアコンを操作
//   hubot 電気(つけて|消して) - 照明を操作

var IRKit = require('irkit');
var signals = require('../config/irkit.json');

module.exports = (robot) => {

  var irkit = new IRKit();

  if ( ! irkit.available() ) { return; }

  var patterns = [
    { regex: /テレビ(点|つ)けて/i,             signal: signals.tv.power,       message: 'テレビをつけましたよ'   },
    { regex: /テレビ(消|け)して/i,             signal: signals.tv.power,       message: 'テレビを消しましたよ'   },
    { regex: /エアコン(点|つ)けて/i,           signal: signals.aircon.on,      message: 'エアコンをつけましたよ' },
    { regex: /エアコン(消|け)して/i,           signal: signals.aircon.off,     message: 'エアコンを消しましたよ' },
    { regex: /Apple\s?TV/i,                    signal: signals.appletv.select, message: 'AppleTV をつけましたよ' },
    { regex: /(電気|照明|ライト)(点|つ)けて/i, signal: signals.light.on,       message: '照明をつけましたよ'     },
    { regex: /(電気|照明|ライト)(消|け)して/i, signal: signals.light.off,      message: '照明を消しましたよ'     },
  ];

  patterns.forEach((pattern) => {
    robot.respond(pattern.regex, (msg) => {
      irkit.send( pattern.signal )
        .then(() => msg.send( pattern.message ))
        .catch((errMsg) => msg.send( errorMsg ));
    });
  });

};
