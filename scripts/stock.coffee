Q = require 'q'
httpcli = require 'cheerio-httpcli'

module.exports = (robot) ->
  stock_list = new StockList robot.brain

  robot.respond /stock list$/i, (msg) ->
    list = stock_list.each (code, name) ->
      code + ' ' + name
    msg.reply list.join "\n"

  robot.respond /stock add (\w+)$/i, (msg) ->
    code = msg.match[1]
    return msg.send 'Already added.' if stock_list.exists code
    stock = new Stock
    Q.when(code).then(stock.get).done (stock) ->
      stock_list.add stock
      msg.send stock.info.code + ' ' + stock.info.name + ' added.'

  robot.respond /stock delete (\w+)$/i, (msg) ->
    code = msg.match[1]
    return msg.send 'Not exists.' unless stock_list.exists code
    stock = new Stock
    Q.when(code).then(stock.get).done (stock) ->
      stock_list.delete stock
      msg.send stock.info.code + ' ' + stock.info.name + ' deleted.'


class StockList

  constructor: (@storage, @key = 'stock_list') ->

  get: (code) ->
    list = @storage.get(@key) ? {}
    if code then list[code] else list

  add: (stock) ->
    list = @get()
    list[stock.info.code] = stock.info.name
    @storage.set @key, list

  delete: (stock) ->
    list = @get()
    delete list[stock.info.code]
    @storage.set @key, list

  exists: (code) ->
    @get(code)?

  each: (callback) ->
    list = @get()
    ret = []
    for k of list
      ret.push callback(k, list[k])
    ret


class Stock

  get: (code) ->
    self = @
    yahoo_stock_baseurl = 'http://stocks.finance.yahoo.co.jp/stocks/detail'
    d = Q.defer()
    httpcli.fetch yahoo_stock_baseurl, { code: code }, (err, $, res) ->
      self.info =
        code: code
        name: $('#stockinf .symbol h1').text()
        price: $('#stockinf .stoksPrice:not(.realTimChange)').text()
        change: $('#stockinf .yjMSt').text()
      d.resolve self
    d.promise

  format: ->
    JSON.stringify @info
