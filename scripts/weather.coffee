request = new require('request')
parser = new require('xml2js')
url = 'http://rss.weather.yahoo.co.jp/rss/days/4410.xml'
CronJob = require('cron').CronJob

replaceWeather = (str) ->
  from = ['晴れ', '晴', '曇り', '曇', '雨', '雪', '時々', '後']
  to   = ['☀', '☀', '☁', '☁', '☔', '❄', '/', '➔']
  str = str.replace(from[i], to[i], "g") for i of from
  return str

module.exports = (robot) ->

  sendWeather = ->
    request url, (error,response,body) ->
      parser.parseString body, (err, result) ->
        info = result.rss.channel[0].item[0].description[0].replace(/- /,"")
        info = replaceWeather(info)
        robot.send {room: '#general' }, "今日の天気は " + info + " ですよ"
        robot.send {room: '#general' }, "傘を忘れないでください" if info.match(/雨/)

  new CronJob('0 30 7 * * *', sendWeather, null, true)

  robot.respond(/天気/, sendWeather)
