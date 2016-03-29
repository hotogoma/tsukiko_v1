// Description:
//   HP が増えたり減ったりするやつ
// Commands:
//   hubot attack <user name> - 攻撃
//   hubot care <username> - 回復
//   hubot status - ステータス表示
//   hubot magic <username> - 魔法攻撃

var cron = require('../lib/cron');
var magic = require('../config/magic.json');
var hpManager = require('hp-manager');
var options = { room: process.env.SLACK_MAIN_CHANNEL };

module.exports = function(robot) {
  var hpMane = new hpManager({
    db: robot.brain,
    max: 100,
    min: 0
  });

  cron('0 0 9 * * 6', function() {
    var list = robot.brain.data;
    hpMane.full_care();
    robot.send(options, '全回復しました');
  });

  robot.respond(/attack (\w+)/i, function(msg) {
    var user = msg.match[1];
    var damage = 10;
    var hp = hpMane.attack(user ,damage);
    msg.send(`${user}は攻撃された. ${damage}のダメージ！\nHP: ${hp}/${hpMane.getMax()}`);
  });

  robot.respond(/care (\w+)/i, function(msg) {
    var user = msg.match[1];
    var point = 10;
    var hp = hpMane.care(user ,point);
    msg.send(`${user}は${point}回復した. HP: ${hp}/${hpMane.getMax()}`);
  });

  robot.respond(/status$/i, function(msg) {
    var list = hpMane.status();
    var status = new Array();

    for(var key in list){
      status.push(`${key} HP: ${list[key]}/${hpMane.getMax()}`);
    }
    msg.send(status.join("\n"));
  });

  robot.respond(/status (\w+)/i, function(msg) {
    var user = msg.match[1];
    var status = hpMane.status(user);

    msg.send(`HP: ${status[user]}/${hpMane.getMax()}`);
  });

  robot.respond(/magic (\w+)/i, function(msg){
    var user = msg.match[1];
    var magicNum = Math.floor(Math.random() * magic.length);
    var magicName = magic[magicNum].name;
    var damage = magic[magicNum].point;
    var hp = hpMane.attack(user ,damage);
    msg.send(`${user}は${magicName}で攻撃された. ${damage}のダメージ！\nHP: ${hp}/${hpMane.getMax()}`);
  });

  robot.respond(/delete (\w+)/i, function(msg) {
    var user = msg.match[1];
    var list = hpMane.delete(user);
    var status = new Array();

    for(var key in list){
      status.push(`${key} HP: ${list[key]}/${hpMane.getMax()}`);
    }
    msg.send(status.join("\n"));
  });

  // タイムラインを全て形態素解析する
  robot.hear(/.*/, function(msg) {
    if ( ! msg.message.tokenized ) { return; }
    var user = msg.message.user.name;
    var damage = 5;

    // ネガティブワードをキャッチする
    msg.message.tokenized.forEach(function(token) {
      if ( /((疲|つか)れる)|((辛|つら)い)|((眠|ねむ)い)/.test(token.basic_form) ) {
        var hp = hpMane.attack(user ,damage);
        msg.send(`${user}は社会から攻撃を受けた！${damage}のダメージ！\nHP: ${hp}/${hpMane.getMax()}`);
      }
    });
  });
};
