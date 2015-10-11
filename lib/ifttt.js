var express_ifttt = require('express-ifttt');

var IFTTT = function(robot, options) {
  if ( ! options ) { options = {}; }
  var path = options.path || '/ifttt/xmlrpc.php';
  var listeners = this.listeners = [];
  robot.router.post(path, express_ifttt, function(req, res) {
    listeners.map(function(listener) {
      if ( listener.handler === req.body.title ) {
        listener.callback.call(listener.context, req.body);
      }
    });
    res.send(200);
  });
};

IFTTT.prototype.on = function(handler, callback, context) {
  if ( ! handler || typeof callback !== 'function' ) {
    throw new TypeError();
  }
  this.listeners.push({
    handler:  handler,
    callback: callback,
    context:  context,
  });
};

module.exports = IFTTT;
