// Description:
//   JavaScript のコードを実行する
// Commands:
//   hubot eval <code> - JavaScript のコードを実行する
'use strict';
var vm = require('vm');
var util = require('util');

const options = { room: process.env.SLACK_MAIN_CHANNEL };

const resultKey = '__EVAL_RESULT__';
const timeout = 1000; // msec

module.exports = (robot) => {

  function safeEval(code) {
    try {
      code = resultKey + '=' + code;
      let context = { [resultKey]: undefined };
      vm.runInNewContext(code, context, { timeout });
      return util.inspect( context[resultKey] );
    }
    catch (e) {
      return e.toString();
    }
  }

  robot.respond(/eval (.+)$/i, (msg) => {
    robot.send(options, safeEval( msg.match[1] ));
  });

};
