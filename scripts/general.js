var getWeather = require('../lib/weather');

module.exports = function(robot) {

  robot.respond(/ぺろぺろ/i, function(msg) {
    msg.reply('まったくどうしようもない変態さんですね');
  });

  robot.hear(/月子ちゃんぺろぺろ/i, function(msg) {
    msg.reply('まったくどうしようもない変態さんですね');
  });

  robot.hear(/^月子ちゃん$/i, function(msg) {
    msg.reply('なんですか');
  });

  robot.hear(/(疲|つか)れた/i, function(msg) {
    msg.reply('おつかれさまです先輩');
  });

  robot.respond(/say (.+)/i, function(msg) {
    robot.send({ room: '#general' }, msg.match[1]);
  });

  robot.respond(/(花金|華金|はなきん)$/i, function(msg) {
    msg.send('花金だーワッショーイ！テンションAGEAGEマック');
  });

  // 日本語版 ping (http://pasero.net/~mako/blog/s/679)
  robot.respond(/(((い|ゐ|居)(て?))(?!り)|(お|を|居)|((い|居)(て?)は)(?!ま))((る|ん(?=の))|((り?)ます)(?!ん))((の?ん?)(です)?|(んだ)(?!か))?(か(い?な?|よ|ね)?|(よ?)(ね|な))?\s?(\?|？)/i, function(msg) {
    msg.send('はい、ここにいます!');
  });

  robot.respond(/天気/, function(msg) {
    getWeather(function(text, emoji) {
      msg.send('今日の天気は ' + emoji + ' です');
    });
  });

};
