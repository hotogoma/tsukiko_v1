request = new require('request')
parser = new require('xml2js')
url = 'http://rss.weather.yahoo.co.jp/rss/days/4410.xml';
CronJob = require('cron').CronJob

module.exports = (robot) ->
  new CronJob '0 30 7 * * *', () ->
    request url, (error,response,body) ->
      parser.parseString body, (err, result) ->
        info = result.rss.channel[0].item[0].description[0]
        info = info.replace(/- /,"")
        robot.send {room: '#general' }, "今日の天気は" + info + "ですよ"
        if info.match(/雨/)
          robot.send {room: '#general' }, "傘を忘れないでください"
  , null, true
