module.exports = (robot) ->

  # 時間遅れで返す
  robot.hear /^want (.+)/i, (msg) ->
    d = new Date()
    year = d.getFullYear()
    month = d.getMonth() + 1
    day = d.getDay()
    msg.send { room: process.env.SLACK_MAIN_CHANNEL }, year + month + day

