CronJob = require('cron').CronJob
cronjob = (crontime, callback) ->
  new CronJob crontime, callback, null, true

module.exports = (robot) ->

  robot.send { room: '#general' }, '＼＼\\\\ ٩( ‘ω’ )و //／／ﾃﾃｰﾝ'

  cronjob '0 30 6 * * 1-5', ->
    robot.send { room: '#general' }, '朝ですよ'

  cronjob '0 0 19 * * 1-5', ->
    robot.send { room: '#general' }, '19時ですよ'

  # 平日前夜(日〜木) 22:00 に「ていうかもう寝よう」
  cronjob '0 0 22 * * 1-4', ->
    robot.send { room: '#general' }, 'https://pbs.twimg.com/media/CHqc3UmUwAAwU4K.jpg'

  robot.respond /ぺろぺろ/i, (msg) ->
    msg.reply 'まったくどうしようもない変態さんですね'

  robot.hear /月子ちゃんぺろぺろ/i, (msg) ->
    msg.reply 'まったくどうしようもない変態さんですね'

  robot.hear /^月子ちゃん$/i, (msg) ->
    msg.reply 'なんですか'

  robot.hear /(疲|つか)れた/i, (msg) ->
    msg.reply 'おつかれさまです先輩'
