CronJob = require('cron').CronJob
cronjob = (crontime, callback) ->
  new CronJob crontime, callback, null, true

module.exports = (robot) ->

  cronjob '0 30 7 * * 3', ->
    robot.send { room: '#general' }, '可燃ごみの日です'

  cronjob '0 30 7 * * 6', ->
    robot.send { room: '#general' }, '可燃ごみの日です'

  cronjob '0 30 7 * * 5', ->
    robot.send { room: '#general' }, '資源ごみの日です'

  cronjob '0 50 14 * * 6', ->
    robot.send { room: '#general' }, '資源ごみの日です'

