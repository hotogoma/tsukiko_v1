'use strict';

let express_ifttt = require('express-ifttt');

class IFTTT {
  constructor(robot, options) {
    if ( ! options ) { options = {}; }
    let path = options.path || '/ifttt/xmlrpc.php';
    let listeners = this.listeners = [];
    robot.router.post(path, express_ifttt, (req, res) => {
      listeners.map((listener) => {
        if ( listener.handler === req.body.title ) {
          listener.callback.call(listener.context, req.body);
        }
      });
      res.send(200);
    });
  }

  on(handler, callback, context) {
    if ( ! handler || typeof callback !== 'function' ) {
      throw new TypeError();
    }
    this.listeners.push({
      handler:  handler,
      callback: callback,
      context:  context,
    });
  }
}

module.exports = IFTTT;
