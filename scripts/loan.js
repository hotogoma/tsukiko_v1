// Description:
//   220万を返済していく軌跡
// Commands:
//   hubot loan - 残額を表示
//   hubot loan init <num> - 残額を初期化 (単位: 万円)
//   hubot loan +<num> - 残額を増やす (単位: 万円)
//   hubot loan -<num> - 残額を減らす (単位: 万円)
'use strict';

const LOAN_KEY = process.env.LOAN_KEY || 'loan';

module.exports = (robot) => {

  function showRemain(msg) {
    let remain = robot.brain.get(LOAN_KEY) || 0;
    msg.send(`現在の残額は ${remain} 万円です`);
  }

  robot.respond(/loan$/i, showRemain);

  robot.respond(/loan init (\d+)$/i, (msg) => {
    showRemain(msg);
    let init = msg.match[1];
    robot.brain.set(LOAN_KEY, init);
    msg.send(`残額を ${init} 万円に設定しました`);
  });

  robot.respond(/loan ((\+|-)?\s?\d+(\.\d+)?)/i, (msg) => {
    let n = parseFloat( msg.match[1].replace(/\s+/, '') );
    if ( isNaN(n) ) { return msg.send('有効な金額ではありません(´･_･`)'); }
    let remain = parseFloat( robot.brain.get(LOAN_KEY) ) || 0;
    robot.brain.set(LOAN_KEY, remain + n);
    if ( n < 0 ) { msg.send(`残額が ${-n} 万円減りました(ﾟ∀ﾟ)`); }
    if ( n > 0 ) { msg.send(`残額が ${n} 万円増えました(´･_･\`)`); }
    showRemain(msg);
  });

};
