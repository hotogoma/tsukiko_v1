// Description:
//   JavaScript のコードを実行する
// Commands:
//   hubot eval <code> - JavaScript のコードを実行する
'use strict';
var vm = require('vm');

const resultKey = '__EVAL_RESULT__';
const timeout = 1000; // msec

module.exports = (robot) => {

  function safeEval(code) {
    try {
      code = resultKey + '=' + code;
      let context = { [resultKey]: undefined };
      let options = { timeout };
      vm.runInNewContext(code, context, options);
      let result = context[resultKey];
      return typeof result === 'object' && ! Array.isArray(result)
        ? JSON.stringify(result, undefined, "\t")
        : result;
    }
    catch (e) {
      return e.toString();
    }
  }

  robot.respond(/eval (.+)$/i, (msg) => {
    msg.send( safeEval( msg.match[1] ) );
  });

};
