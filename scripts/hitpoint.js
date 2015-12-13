var hpMax = 100;
var hpMin = 0;
var cron = require('../lib/cron');
var magic = require('../magic.json');
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
    var damage = 10;
    hp = attack(user, damage);
    msg.send(`${user}は攻撃された. ${damage}のダメージ！\nHP: ${hp}/${hpMax}`);
  });

  robot.respond(/care (\w+)/i, function(msg) {
    var user = msg.match[1];
    var point = 10;
    var hp = care(user, point);
    msg.send(`${user}回復した. HP: ${hp}/${hpMax}`);
  });

  robot.respond(/status/, function(msg) {
    var list = robot.brain.data;
    var status = new Array();
    for(var key in list._private){
      status.push(`${key} HP: ${list._private[key]}/${hpMax}`);
    }
    msg.send(status.join("\n"));
  });

  robot.respond(/magic (\w+)/i, function(msg){
    var user = msg.match[1];
    var magicNum = Math.floor(Math.random() * magic.length);
    var magicName = magic[magicNum].name;
    var damage = magic[magicNum].point;
    var hp = attack(user, damage);
    msg.send(`${user}は${magicName}で攻撃された. ${damage}のダメージ！\nHP: ${hp}/${hpMax}`);
  });

  // タイムラインを全て形態素解析する
  robot.hear(/.*/, function(msg) {
    if ( ! msg.message.tokenized ) { return; }
    var user = msg.message.user.name;
    var damage = 5;

    // ネガティブワードをキャッチする
    msg.message.tokenized.forEach(function(token) {
      if ( /((疲|つか)れる)|((辛|つら)い)|((眠|ねむ)い)/.test(token.basic_form) ) {
        var hp = attack(user, damage);
        msg.send(`${user}は社会から攻撃を受けた！${damage}のダメージ！\nHP: ${hp}/${hpMax}`);
      }
    });
  });

  function attack(user, damage){
    var hp = robot.brain.get(user);
    hp = (hp !== null) ? hp : hpMax;
    hp = Math.max(hp - damage, hpMin);
    robot.brain.set(user, hp);
    return hp;
  }

  function care(user, point){
    var hp = robot.brain.get(user);
    hp = (hp !== null) ? hp : hpMax;
    hp = Math.min(hp + 10, hpMax);
    robot.brain.set(user, hp);
    return hp;
  }

};


