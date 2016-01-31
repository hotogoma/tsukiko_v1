// Description:
//   trelloに投稿
// Commands:
//   hubot todo <card name> - カードを追加  

Trello = require("node-trello")

module.exports = function(robot) {
  robot.respond(/todo (\w+)/i, function(msg) {
    var title = msg.match[1];
    trello = new Trello(process.env.HUBOT_TRELLO_KEY, process.env.HUBOT_TRELLO_TOKEN);
    trello.post("/1/cards", {name: title, idList: process.env.HUBOT_TRELLO_TODO}, function(err, data){
      if(err){
        msg.send("保存に失敗しました");
        return;
      }else{
        msg.send(`「 ${title} 」 をTrelloのやりたいことボードに保存しました`);
      }
    });
  });
};
