// wrapper for kuromoji.js
'use strict';

let kuromoji = require('kuromoji');

class Kuromoji {
  constructor(dicPath) {
    this.tokenizer = null;
    dicPath = dicPath || 'node_modules/kuromoji/dist/dict/';
    kuromoji.builder({ dicPath: dicPath }).build((err, tokenizer) => {
      if (err) { throw err; }
      this.tokenizer = tokenizer;
    });
  }

  tokenize(str) {
    // 辞書が読み込めていなかったら false
    if ( ! this.tokenizer ) { return false; }
    return this.tokenizer.tokenize(str);
  }
}

module.exports = Kuromoji;
