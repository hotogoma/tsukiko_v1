'use strict';

var request = require('request');
var commands = require('../config/irkit.json');

module.exports = {

  messages: function(command, onSuccess, onError, context) {
    var api_url = 'https://api.getirkit.com/1/messages';

    var client_key = process.env.IRKIT_CLIENT_KEY;
    var device_id  = process.env.IRKIT_DEVICE_ID;

    if ( ! client_key || ! device_id ) {
      onError.call(context, 'client_key か device_id が設定されていません');
      return;
    }

    if ( ! commands[ command ] ) {
      onError.call(context, '存在しないコマンドです');
      return;
    }

    var options = {
      url: api_url,
      form: {
        clientkey: client_key,
        deviceid:  device_id,
        message:   JSON.stringify( commands[ command ] ),
      }
    };

    request.post(options, function(error) {
      if ( error && onError ) {
        console.error(error);
        onError.call(context, 'IRKit への接続に失敗しました');
      }
      else {
        onSuccess.call(context);
      }
    });

  },

};
