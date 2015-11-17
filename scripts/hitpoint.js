var hpMax = 100;
var hpMin = 0;
var cron = require('../lib/cron');

module.exports = function(robot) {
  cron('0 * * * * *', function() {
    var list = robot.brain.data;
    for(var key in list._private){
      robot.brain.set(key, hpMax);
    }
  });

  robot.respond(/attack (.+)/i, function(msg) {
    var user = msg.match[1];
    var hp = robot.brain.get(user) - 10;
    if (hp >= hpMin){
      robot.brain.set(user, hp);
    } else{
      robot.brain.set(user, hpMin);
    }
    msg.reply(user + 'は攻撃された' + 'HP' + robot.brain.get(user) + '/' + hpMax);
  });

  robot.respond(/care (.+)/i, function(msg) {
    var user = msg.match[1];
    var hp = robot.brain.get(user) + 10;
    if (hp < hpMax){
      robot.brain.set(user, hp);
    } else {
      robot.brain.set(user, hpMax);
    }
    msg.reply(user + 'は回復した' + 'HP' + robot.brain.get(user) + '/' + hpMax);
  });

  robot.respond(/status/, function(msg) {
    var list = robot.brain.data;
    for(var key in list._private){
      msg.reply(key + ' HP:' + list._private[key] + '/' + hpMax);
    }
  });
};


