MeCab = new require('mecab-async')
mecab = new MeCab()

module.exports = (robot) ->

  # 形態素解析した結果を返す
  robot.hear /^parse (.+)/i, (msg) ->
    parsed = mecab.parseSync msg.match[1]
    msg.send parsed.map( (v) -> v.join('\t')  ).join("\n")

  # メンション内容を形態素解析して反応する
  robot.respond /.*/, (msg) ->
    parsed = mecab.parseSyncFormat msg.message.text

    # 感動詞をオウム返しする
    parsed.map (word) ->
      msg.reply word.original if word.lexical == '感動詞'
