/**
 * IFTTT
 */
var IFTTT = require('../lib/ifttt');

var options = { room: process.env.SLACK_MAIN_CHANNEL };

module.exports = function(robot) {
  var ifttt = new IFTTT(robot);

  // 退社を通知
  ifttt.on('leftOffice', function(data) {
    robot.send(options, '【' + data.description + '】ﾀｲｼｬ!!');
  });

};
