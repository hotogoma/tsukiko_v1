"use strict"

let BigQuery = new ( require('./bigquery') );

let expenses = {};

// N ヶ月前の 25 日の Date オブジェクトを返す
let monthAgo = function(n) {
  var d = new Date();
  return new Date( d.getFullYear(), d.getMonth() - n, 25 );
};

expenses.enable = function() {
  return BigQuery.enable();
}

expenses.getReport = function(callback) {

  const queries = [
    [
      'SELECT SUM(value) AS sum, AVG(value) AS average, STDDEV(value) AS stddev, type',
      'FROM [expenses.master] GROUP BY type',
    ],
    [
      'SELECT SUM(value) AS sum, AVG(value) AS average, STDDEV(value) AS stddev, type',
      'FROM [expenses.master]',
      'WHERE "' + monthAgo(2).toISOString() + '" <= date AND date < "' + monthAgo(1).toISOString() + '"',
      'GROUP BY type'
    ],
    [
      'SELECT SUM(value) AS sum, AVG(value) AS average, STDDEV(value) AS stddev, type',
      'FROM [expenses.master]',
      'WHERE "' + monthAgo(3).toISOString() + '" <= date AND date < "' + monthAgo(2).toISOString() + '"',
      'GROUP BY type'
    ],
  ];

  Promise.all(queries.map((query) => {
    return new Promise((resolve, reject) => {
      BigQuery.query(query.join(' '), (err, rows) => {
        err ? reject(err) : resolve(rows);
      })
    })
  })).then((results) => {
    results = results.map((result) => {
      let types = {};
      let total = 0;
      result.map((row) => {
        let type = row.type === null ? 'その他' : row.type;
        types[ type ] = row;
        total += parseInt( row.sum );
      });
      types.total = total;
      return types;
    });
    if ( callback ) {
      callback(null, results[0], results[1], results[2]);
    }
  }).catch((err) => {
    if ( callback ) { callback(err) }
    else { throw err }
  });
};

module.exports = expenses;
