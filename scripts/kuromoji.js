// Description:
//   形態素解析する系
'use strict';

let Kuromoji = require('../lib/kuromoji');
let kuromoji = new Kuromoji();

module.exports = (robot) => {

  // メンション内容を形態素解析して反応する
  robot.respond(/.*/, (msg) => {
    let parsed = kuromoji.tokenize( msg.message.text );
    if ( ! parsed ) { return; }

    // 感動詞をオウム返しする
    parsed.forEach((token) => {
      if ( token.pos == '感動詞' ) {
        msg.reply( token.surface_form );
      }
    });

  });

};
