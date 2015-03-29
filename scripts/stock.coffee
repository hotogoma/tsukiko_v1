Q = require 'q'
httpcli = require 'cheerio-httpcli'

module.exports = (robot) ->
  stock_list = new StockList robot.brain

  # 登録してある証券コード一覧を表示
  robot.respond /stock list$/i, (msg) ->
    list = stock_list.each (code, name) ->
      "【#{code}】 #{name}"
    msg.send list.join "\n"

  # 証券コードを登録
  robot.respond /stock add (\w+)$/i, (msg) ->
    code = msg.match[1]
    return msg.send 'Already added.' if stock_list.exists code
    stock = new Stock
    Q.when(stock.get(code)).done (stock) ->
      stock_list.add stock
      msg.send "【#{stock.info.code}】 #{stock.info.name} added."

  # 証券コードを削除
  robot.respond /stock delete (\w+)$/i, (msg) ->
    code = msg.match[1]
    return msg.send 'Not exists.' unless stock_list.exists code
    stock = new Stock
    Q.when(stock.get(code)).done (stock) ->
      stock_list.delete stock
      msg.send "【#{stock.info.code}】 #{stock.info.name} deleted."

  # 証券コードから株価を表示
  robot.respond /stock info (\w+)$/i, (msg) ->
    code = msg.match[1]
    stock = new Stock
    Q.when(stock.get(code)).done (stock) ->
      msg.send stock.format()

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
    switch @info.change.slice(0, 1)
      when '+' then arr = '↑'
      when '-' then arr = '↓'
      else arr = '→'
    "【#{@info.code}】 #{@info.name} #{@info.price} #{arr} #{@info.change}"

