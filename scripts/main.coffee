CronJob = require('cron').CronJob
cronjob = (crontime, callback) ->
  new CronJob crontime, callback, null, true

module.exports = (robot) ->

  # 起動時にﾃﾃｰﾝ
  #robot.send { room: '#general' }, '＼＼\\\\ ٩( ‘ω’ )و //／／ﾃﾃｰﾝ'

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

  robot.respond /say (.+)/i, (msg) ->
    robot.send { room: '#general' }, msg.match[1]

  # 日本語版 ping (http://pasero.net/~mako/blog/s/679)
  robot.respond /(((い|ゐ|居)(て?))(?!り)|(お|を|居)|((い|居)(て?)は)(?!ま))((る|ん(?=の))|((り?)ます)(?!ん))((の?ん?)(です)?|(んだ)(?!か))?(か(い?な?|よ|ね)?|(よ?)(ね|な))?\s?(\?|？)/i, (msg) ->
    msg.send "はい、ここにいます!"

