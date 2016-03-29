'use strict';

var request = require('request');

class IRKit {

  constructor(opts) {
    opts = opts || {};
    this.clientKey = opts.clientKey || process.env.IRKIT_CLIENT_KEY;
    this.deviceId  = opts.deviceId  || process.env.IRKIT_DEVICE_ID;
    this.apiUrl    = opts.apiUrl    || process.env.IRKIT_API_URL || 'https://api.getirkit.com/1/messages';
  }

  available() {
    return ( this.clientKey && this.deviceId && this.apiUrl );
  }

  send(signal) {
    return new Promise((resolve, reject) => {
      if ( typeof signal !== 'object' ) {
        return reject('Invalid signal.');
      }
      if ( ! this.available() ) {
        return reject('IRKit is unavailable.');
      }
      var data = {
        url: this.apiUrl,
        form: {
          clientkey: this.clientKey,
          deviceid:  this.deviceId,
          message:   JSON.stringify(signal),
        }
      };
      request.post(data, (err) => {
        if ( err ) {
          console.error(err);
          return reject('Failed to connect IRKit API.');
        }
        resolve();
      });
    });
  }

}

module.exports = IRKit;
