module.exports = function(robot) {
  robot.respond(/魔法/i, function(msg) {
    var magic = ['ファイア','サンダー','ブリザド','ウォータ','ファイラ','サンダラ','ブリザラ','ウォータラ','ファイガ','サンダガ','ブリザガ','ウォータガ','デス','ホーリー','フレア','グラビデ','メテオ','アルテマ','プロテス','ヘイスト','リフレク','シェル','ケアル','ケアルア','ケアルガ','リジェネ','レイズ'];
    var dayObj = new Date();
    var i = dayObj.getTime() % magic.length
    msg.send(magic[i] + '!!');
  });
};
