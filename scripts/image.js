// Description:
//   画像を表示
// Commands:
//   hubot image <query> - 画像を検索して表示
'use strict';

let GoogleImages = require('google-images');

module.exports = (robot) => {

  const GOOGLE_CSE_ID  = process.env.GOOGLE_CSE_ID;
  const GOOGLE_CSE_KEY = process.env.GOOGLE_CSE_KEY;

  if ( ! GOOGLE_CSE_ID || ! GOOGLE_CSE_KEY ) { return; }

  let client = GoogleImages(GOOGLE_CSE_ID, GOOGLE_CSE_KEY);

  robot.respond(/image (.+)$/i, (msg) => {
    let query = msg.match[1];
    client.search(query).then((images) => {
      if ( images.length === 0 ) { return; }
      let image = msg.random(images);
      msg.send(image.url);
    });
  });

};
