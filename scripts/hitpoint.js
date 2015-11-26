var hpMax = 100;
var hpMin = 0;
var cron = require('../lib/cron');
var magic = require('../magic.json');
var Kuromoji = require('../lib/kuromoji');
kuromoji = new Kuromoji();
var options = { room: process.env.SLACK_MAIN_CHANNEL };

module.exports = function(robot) {
  cron('0 0 9 * * 6', function() {
    var list = robot.brain.data;
    for(var key in list._private){
      robot.brain.set(key, hpMax);
    }
    robot.send(options, '全回復しました');
  });

  robot.respond(/attack (\w+)/i, function(msg) {
    var user = msg.match[1];
    var hp = robot.brain.get(user);
    var point = 10;
    hp = attack(hp, point);
    robot.brain.set(user, hp);
    msg.reply(`${user}は攻撃された. ${point}のダメージ！\nHP: ${hp}/${hpMax}`);
  });

  robot.respond(/care (\w+)/i, function(msg) {
    var user = msg.match[1];
    var hp = robot.brain.get(user);
    var point = 10;
    hp = care(hp, point);
    robot.brain.set(user, hp);
    msg.reply(`${user}回復した. HP: ${hp}/${hpMax}`);
  });

  robot.respond(/status/, function(msg) {
    var list = robot.brain.data;
    var status = new Array();
    for(var key in list._private){
      if(typeof(list._private[key]) === 'number'){
        status.push(`${key} HP: ${list._private[key]}/${hpMax}`);
      }
    }
    msg.reply(status.join("\n"));
  });

  robot.respond(/magic (\w+)/i, function(msg){
    var user = msg.match[1];
    var magicNum = Math.floor(Math.random() * magic.length);
    var magicName = magic[magicNum].name;
    var point = magic[magicNum].point;
    var hp = robot.brain.get(user);
    hp = attack(hp, point);
    robot.brain.set(user, hp);
    msg.reply(`${user}は${magicName}で攻撃された. ${point}のダメージ！\nHP: ${hp}/${hpMax}`);
  });

  // タイムラインを全て形態素解析する
  robot.hear(/.*/, function(msg) {
    var parsed = kuromoji.tokenize( msg.message.text );
    if ( ! parsed ) { return; }

    // ネガティブワードをキャッチする
    parsed.forEach(function(token) {
      if ( /(疲れる)|((辛|つら)い)|((眠|ねむ)い)/.test(token.basic_form) ) {
        var user = msg.message.user.name;
        var hp = robot.brain.get(user);
        var point = 5;
        hp = attack(hp, point);
        robot.brain.set(user, hp);
        msg.reply(`${user}は攻撃された. ${point}のダメージ！\nHP: ${hp}/${hpMax}`);
      }
    });

  });

};

function attack(hp, damage){
    hp = (hp !== null) ? hp : hpMax;
    hp = Math.max(hp - damage, hpMin);
    return hp;
}

function care(hp, point){
    hp = (hp !== null) ? hp : hpMax;
    hp = Math.min(hp + 10, hpMax);
    return hp;
}
