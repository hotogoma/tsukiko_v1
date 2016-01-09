// Description:
//   Web サーバ
'use strict';

let serveStatic = require('serve-static');

module.exports = (robot) => {

  robot.router.use(serveStatic('public'));

};
