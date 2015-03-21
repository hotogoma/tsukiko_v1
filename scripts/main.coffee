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

  robot.hear /^月子ちゃん$/i, (msg) ->
    msg.reply 'なんですか'

  robot.hear /(疲|つか)れた/i, (msg) ->
    msg.reply 'おつかれさまです先輩'

  # 形態素解析した結果を返す
  robot.hear /^parse (.+)/i, (msg) ->
    msg.message.text.parse (res) ->
      msg.reply res.map(JSON.stringify).join("\n")

  # メンション内容を形態素解析して反応する
  robot.respond /.*/, (msg) ->
    msg.message.text.parse (res) ->

      # 感動詞をオウム返しする
      res.map (word) ->
        msg.reply word.surface if word.pos == '感動詞'
