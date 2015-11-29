// Description:
//   形態素解析する系
'use strict';

module.exports = (robot) => {

  // メンション内容を形態素解析して反応する
  robot.respond(/.*/, (msg) => {
    if ( ! msg.message.tokenized ) { return; }

    // 感動詞をオウム返しする
    msg.message.tokenized.forEach((token) => {
      if ( token.pos == '感動詞' ) {
        msg.reply( token.surface_form );
      }
    });

  });

};
