module.exports = function(robot) {
  robot.respond(/魔法/, function(msg) {
    var magic = ['ファイア','サンダー','ブリザド','ウォータ','ファイラ','サンダラ','ブリザラ','ウォータラ','ファイガ','サンダガ','ブリザガ','ウォータガ','デス','ホーリー','フレア','グラビデ','メテオ','アルテマ','プロテス','ヘイスト','リフレク','シェル','ケアル','ケアルア','ケアルガ','リジェネ','レイズ'];
    var i = Math.floor(Math.random() * magic.length);
    msg.send(magic[i] + '!!');
  });
};
