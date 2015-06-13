CronJob = require('cron').CronJob
cronjob = (crontime, callback) ->
  new CronJob crontime, callback, null, true

module.exports = (robot) ->

  robot.send { room: '#general' }, '＼＼\\\\ ٩( ‘ω’ )و //／／ﾃﾃｰﾝ'

  cronjob '0 30 7 * * 1-5', ->
    robot.send { room: '#general' }, '朝ですよ'

  cronjob '0 0 19 * * 1-5', ->
    #robot.reply { room: '#general', user: { name: 'hoto' } }, 'ごはん'
    robot.reply { room: '#general' }, '19時ですよ'

  robot.respond /ぺろぺろ/i, (msg) ->
    msg.reply 'まったくどうしようもない変態さんですね'

  robot.hear /月子ちゃんぺろぺろ/i, (msg) ->
    msg.reply 'まったくどうしようもない変態さんですね'

  robot.hear /^月子ちゃん$/i, (msg) ->
    msg.reply 'なんですか'

  robot.hear /(疲|つか)れた/i, (msg) ->
    msg.reply 'おつかれさまです先輩'
