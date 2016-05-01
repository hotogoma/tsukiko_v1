// Description:
//   きょうのごはんは
// Commands:
//   hubot 特売 - 今日の特売情報を表示
'use strict';

let Cookpad = require('../lib/cookpad');

module.exports = (robot) => {

  robot.respond(/特売$/i, (msg) => {
    Cookpad.bargains().then((bargains) => {
      var text = [
        `今日の ${bargains.shop} の特売情報ですよ`,
        bargains.url,
      ];
      var items = bargains.items.map((item) => '・ ' + item);
      msg.send( text.concat(items).join("\n") );
    });
  });

};
