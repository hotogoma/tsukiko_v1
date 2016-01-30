// Description:
//   HP が増えたり減ったりするやつ
// Commands:
//   hubot attack <user name> - 攻撃
//   hubot care <username> - 回復
//   hubot status - ステータス表示
//   hubot magic <username> - 魔法攻撃

var cron = require('../lib/cron');
var magic = require('../magic.json');
var hpManager = require('hp-manager');
var options = { room: process.env.SLACK_MAIN_CHANNEL };

module.exports = function(robot) {
  var hpMane = new hpManager({ db: robot.brain});

  robot.respond(/attack (\w+)/i, function(msg) {
    var user = msg.match[1];
    var damage = 10;
    var hp = hpMane.attack(user ,damage);
    msg.send(`${user}は攻撃された. ${damage}のダメージ！\nHP: ${hp}/${hpMax}`);
  });

  robot.respond(/care (\w+)/i, function(msg) {
    var user = msg.match[1];
    var point = 10;
    var hp = hpMane.care(user ,point);
    msg.send(`${user}は${point}回復した. HP: ${hp}/${hpMax}`);
  });

  robot.respond(/status$/i, function(msg) {
    var list = hpMane.status();
    var status = new Array();

    for(var key in list){
      status.push(`${key} HP: ${list[key]}/${hpMax}`);
    }
    msg.send(status.join("\n"));
  });

  robot.respond(/status (\w+)/i, function(msg) {
    var user = msg.match[1];
    var list = hpMane.status(user);
    var status = new Array();

    for(var key in list){
      status.push(`${key} HP: ${list[key]}/${hpMax}`);
    }
    msg.send(status.join("\n"));
  });

  robot.respond(/magic (\w+)/i, function(msg){
    var user = msg.match[1];
    var magicNum = Math.floor(Math.random() * magic.length);
    var magicName = magic[magicNum].name;
    var damage = magic[magicNum].point;
    var hp = hpMane.attack(user ,damage);
    msg.send(`${user}は${magicName}で攻撃された. ${damage}のダメージ！\nHP: ${hp}/${hpMax}`);
  });

  robot.respond(/delete (\w+)/i, function(msg) {
    var user = msg.match[1];
    var list = hpMane.delete(user);
    var status = new Array();

    for(var key in list){
      status.push(`${key} HP: ${list[key]}/${hpMax}`);
    }
    msg.send(status.join("\n"));
  });


};
