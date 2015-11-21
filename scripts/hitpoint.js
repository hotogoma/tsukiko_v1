var hpMax = 100;
var hpMin = 0;
var cron = require('../lib/cron');

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
    hp = (hp !== null) ? hp : hpMax;
    hp = Math.max(hp - 10, hpMin);
    robot.brain.set(user, hp);
    msg.reply(user + 'は攻撃された' + 'HP' + hp + '/' + hpMax);
  });

  robot.respond(/care (\w+)/i, function(msg) {
    var user = msg.match[1];
    var hp = robot.brain.get(user);
    hp = (hp !== null) ? hp : hpMax;
    hp = Math.min(hp + 10, hpMax);
    robot.brain.set(user, hp);
    msg.reply(user + 'は回復した' + 'HP' + hp + '/' + hpMax);
  });

  robot.respond(/status/, function(msg) {
    var list = robot.brain.data;
    var status = new Array();
    for(var key in list._private){
      status.push(key + ' HP:' + list._private[key] + '/' + hpMax);
    }
    msg.reply(status.join("\n"));
  });
};


