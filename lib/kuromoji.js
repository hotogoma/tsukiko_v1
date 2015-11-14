// wrapper for kuromoji.js

var kuromoji = require('kuromoji');

var Kuromoji = function(dicPath) {
  this.tokenizer = null;
  dicPath = dicPath || 'node_modules/kuromoji/dist/dict/';
  kuromoji.builder({ dicPath: dicPath }).build((err, tokenizer) => {
    if (err) { throw err; }
    this.tokenizer = tokenizer;
  });
};

Kuromoji.prototype.tokenize = function(str) {
  // 辞書が読み込めていなかったら false
  if ( ! this.tokenizer ) { return false; }
  return this.tokenizer.tokenize(str);
};

module.exports = Kuromoji;
