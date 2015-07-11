var BigQuery = require('./bigquery');
var Q = require('q');

var expenses = {};

// N ヶ月前の 25 日の Date オブジェクトを返す
var monthAgo = function(n) {
  var d = new Date();
  return new Date( d.getFullYear(), d.getMonth() - n, 25 );
};

expenses.getReport = function(callback) {

  var queries = [
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

  Q.all(queries.map(function(query) {
    var d = Q.defer();

    BigQuery.query(query.join(' '), function(err, rows) {
      err ? d.reject(err) : d.resolve(rows);
    });

    return d.promise;
  })).then(function(results) {
    var d = Q.defer();

    results = results.map(function(result) {
      var types = {};
      var total = 0;
      result.map(function(row) {
        var type = row.type === null ? 'その他' : row.type;
        types[ type ] = row;
        total += parseInt( row.sum );
      });
      types.total = total;
      return types;
    });
    if ( callback ) {
      callback(null, results[0], results[1], results[2]);
    }

    d.resolve();
    return d.promise;
  }).fail(function(err) {
    var d = Q.defer();

    console.error(err);
    if ( callback ) {
      callback(err);
    }

    d.resolve();
    return d.promise;
  });
};

module.exports = expenses;
