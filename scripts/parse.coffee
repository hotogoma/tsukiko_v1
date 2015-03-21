request = require 'request'
xml2js = require 'xml2js'
token = process.env.YAHOO_API_TOKEN

String.prototype.parse = (success, fail) ->
  options = {
    url: 'http://jlp.yahooapis.jp/MAService/V1/parse'
    headers: { 'User-Agent': 'Yahoo AppID:' + token }
    form: { sentence: @toString() }
  }

  request.post options, (err, res, xml) ->
    if ! err && res.statusCode == 200
      xml2js.parseString xml, { explicitArray: false }, (err, json) ->
        success json.ResultSet.ma_result.word_list.word
    else if fail
      fail(err, res)
