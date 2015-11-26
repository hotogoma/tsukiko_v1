// Description:
//   別ファイルに切り出すまでもない設定はここに書く
'use strict';

let getWeather = require('../lib/weather');

module.exports = (robot) => {

  robot.respond(/ぺろぺろ/i, (msg) => msg.reply('まったくどうしようもない変態さんですね'));
  robot.hear(/月子ちゃんぺろぺろ/i, (msg) => msg.reply('まったくどうしようもない変態さんですね'));
  robot.hear(/^月子ちゃん$/i, (msg) => msg.reply('なんですか'));
  robot.hear(/(疲|つか)れた/i, (msg) => msg.reply('おつかれさまです先輩'));

  robot.respond(/天気/, (msg) => getWeather((_, emoji) => msg.send('今日の天気は ' + emoji + ' です')));

  robot.respond(/(花金|華金|はなきん)$/i, (msg) => msg.send('花金だーワッショーイ！テンションAGEAGEマック'));

  robot.respond(/say (.+)/i, (msg) => robot.send({ room: process.env.SLACK_MAIN_CHANNEL }, msg.match[1]));

  robot.respond(/PING$/i, (msg) => msg.reply('PONG!'));

  // 日本語版 ping (http://pasero.net/~mako/blog/s/679)
  const pingRegex = /(((い|ゐ|居)(て?))(?!り)|(お|を|居)|((い|居)(て?)は)(?!ま))((る|ん(?=の))|((り?)ます)(?!ん))((の?ん?)(です)?|(んだ)(?!か))?(か(い?な?|よ|ね)?|(よ?)(ね|な))?\s?(\?|？)/i;
  robot.respond(pingRegex, (msg) => msg.send('はい、ここにいます!'));

};
