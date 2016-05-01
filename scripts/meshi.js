// Description:
//   きょうのごはんは
// Commands:
//   hubot 特売 - 今日の特売情報を表示
'use strict';

let Cookpad = require('../lib/cookpad');

const BARGAINS = [
  {
    shop: '文化堂 戸越銀座店',
    url: 'https://cookpad.com/bargains/%E6%96%87%E5%8C%96%E5%A0%82/4114',
  },
];

module.exports = (robot) => {

  robot.respond(/特売$/i, (msg) => {
    var bargains = BARGAINS[0];
    Cookpad.bargains(bargains.url).then((items) => {
      var text = [
        `今日の ${bargains.shop} の特売情報ですよ`,
        bargains.url,
      ];
      items = items.map((item) => '・ ' + item);
      text = text.concat(items).join("\n");
      msg.send(text);
    });
  });

};
