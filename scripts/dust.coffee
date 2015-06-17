CronJob = require('cron').CronJob
cronjob = (crontime, callback) ->
  new CronJob crontime, callback, null, true

module.exports = (robot) ->

  cronjob '5 30 6 * * 3', ->
    robot.send { room: '#general' }, '可燃ごみの日です'

  cronjob '5 30 6 * * 6', ->
    robot.send { room: '#general' }, '可燃ごみの日です'

  cronjob '5 30 6 * * 5', ->
    robot.send { room: '#general' }, '資源ごみの日です'
