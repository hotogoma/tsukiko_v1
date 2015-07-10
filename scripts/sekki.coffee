date2sekki = require('../lib/date2sekki')

CronJob = require('cron').CronJob
cronjob = (crontime, callback) ->
  new CronJob crontime, callback, null, true

module.exports = (robot) ->

  # 二十四節気の日だったらつぶやく
  cronjob '10 30 6 * * 1-5', ->
    sekki = date2sekki( new Date() )
    if sekki
      robot.send { room: '#general' }, "本日は #{sekki[0]} です"
      robot.send { room: '#general' }, "#{sekki[1]}〜"
