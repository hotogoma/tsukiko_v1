// 形態素解析する系

var MeCab = new require('mecab-async');
var mecab = new MeCab();

module.exports = function(robot) {

  // 形態素解析した結果を返す
  robot.hear(/^parse (.+)/i, function(msg) {
    var parsed = mecab.parseSync( msg.match[1] );
    parsed = parsed.map(function(row) { return row.join('\t'); }).join("\n");
    msg.send(parsed);
  });

  // メンション内容を形態素解析して反応する
  robot.respond(/.*/, function(msg) {
    var parsed = mecab.parseSyncFormat( msg.message.text );

    // 感動詞をオウム返しする
    parsed.map(function(word) {
      if ( word.lexical == '感動詞' ) {
        msg.reply( word.original );
      }
    });

  });

};
