var localDir = 'bundle';
var serverDir = '//svtlsre01-pic/web/IMAInter';

var fs = require('fs');
var shelljs = require('shelljs');

var contentSvr = shelljs.ls('-A', serverDir);

shelljs.echo('delete:')
contentSvr.map(function(f) {
    var path = serverDir + '/' + f;
    shelljs.echo(path);
    shelljs.rm('-rf', path);
});

var localContent = shelljs.ls(localDir);
shelljs.echo('copy:')
localContent.map(function(f) {

    // filtres:

    var lpath = localDir + '/' + f;
    var rpath = serverDir + '/' + f;
    shelljs.echo(lpath + ' -> ' + rpath);
    shelljs.cp('-rf', lpath, serverDir);

});