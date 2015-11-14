// Description:
//   形態素解析する系

var Kuromoji = require('../lib/kuromoji');
kuromoji = new Kuromoji();

module.exports = function(robot) {

  // メンション内容を形態素解析して反応する
  robot.respond(/.*/, function(msg) {
    var parsed = kuromoji.tokenize( msg.message.text );
    if ( ! parsed ) { return; }

    // 感動詞をオウム返しする
    parsed.forEach(function(token) {
      if ( token.pos == '感動詞' ) {
        msg.reply( token.surface_form );
      }
    });

  });

};
