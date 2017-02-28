var fs = require('fs');
var shelljs = require('shelljs');

var destir = process.argv[2];
if (!destir) {
    shelljs.echo("usage: node resources_copy (relative destination directory)")
    return -1;
}

shelljs.rm('-rf', destir);
shelljs.mkdir(destir);

var resources = JSON.parse(shelljs.cat('resources_files.json'));

resources.map(function(f) {
    var destPath = f.dest ? f.dest.split('/') : f.source.split('/');
    var destDir = destir + '/' + destPath.slice(0, destPath.length - 1).join('/');
    var destFile = destPath.slice(destPath.length - 1, destPath.length)[0];

    if (destPath.length > 1)
        shelljs.mkdir('-p', destDir);

    shelljs.cp('-rf', f.source, destDir + '/' + destFile);
});