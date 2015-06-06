module.exports = (robot) ->

  # 時間遅れで返す
  robot.hear /^want (.+)/i, (msg) ->
    d = new Date()
    year = d.getFullYear()
    month = d.getMonth() + 1
    day = d.getDay()
    msg.send { room: '#general' }, year + month + day

