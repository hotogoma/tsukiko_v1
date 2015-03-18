CronJob = require('cron').CronJob

module.exports = (robot) ->
  new CronJob '0 30 7 * * 1-5', ->
    robot.send { room: '#general' }, '朝ですよ'

  new CronJob '0 0 19 * * 1-5', ->
    robot.reply { room: '#general', user: { name: 'hoto' } }, 'ごはん'

  robot.respond /ぺろぺろ/i, (msg) ->
    msg.reply 'まったくどうしようもない変態さんですね'

  robot.hear /月子ちゃんぺろぺろ/i, (msg) ->
    msg.reply 'まったくどうしようもない変態さんですね'
