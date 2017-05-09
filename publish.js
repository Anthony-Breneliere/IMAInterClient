var localDir = 'bundle';
var serverDir = '//svtlsre01-pic/web/IMAInter';

var fs = require('fs');
var shelljs = require('shelljs');

// listing du contenu du dossier serveur
var contentSvr = shelljs.ls('-A', serverDir);

// suppression des fichiers sur le serveur
shelljs.echo('delete:')
contentSvr.map(function(f) {
    var path = serverDir + '/' + f;
    shelljs.echo(path);
    shelljs.rm('-rf', path);
});

// listing du contenu en local
var localContent = shelljs.ls(localDir);

// copie des fichiers sur le serveur
shelljs.echo('copy:')
localContent.map(function(f) {
    var lpath = localDir + '/' + f;
    var rpath = serverDir + '/' + f;
    shelljs.echo(lpath + ' -> ' + rpath);
    shelljs.cp('-rf', lpath, serverDir);
});

// copie du fichier de config du serveur
shelljs.cp('-f', 'data/imainter.recette.json', `${serverDir}/data/imainter.json`);