#!/usr/bin/env node

var join = require('path').join;
var fullScriptsPath = join(process.cwd(), 'scripts.json');
var errorExit = require('./lib/errorExit');
var run = require('./lib/run');

try {
    var scripts = require(fullScriptsPath);
} catch(e) {
    errorExit(e.toString());
}

!process.argv[2] && errorExit('No script name presented!');

process.stdout.write('Starting script: \x1b[37m' + process.argv[2] + '\x1b[0m\n');

function buildPattern(name) {
    var re = /<%\w+%>/, match, data = [];
    while(match = re.exec(name)) {
        name = name.replace(match[0], '(\\w+)');
        data.push(match[0].slice(2, -2))
    }
    return {
        regexp: new RegExp('^' + name + '$'),
        params: data
    }
}

for(var l = scripts.length, i=0; i < l; i++) {
    pattern = buildPattern(scripts[i].name);
    if (pattern.regexp.exec(process.env[2])) {
        console.log('good')
    } else
        console.log('bad')
}

var TemplateEngine = function(tpl, data) {
    var re = /<%([^%>]+)?%>/g, match;
    while(match = re.exec(tpl)) {
        tpl = tpl.replace(match[0], data[match[1]])
    }
    return tpl;
}

run(scripts[0], function (error, stdout, stderr) {
    process.stderr.write(stderr);
    process.stdout.write(stdout);
    if(error !== null) {
        errorExit('runtime error: ' + error);
    }
});

process.stdout.write('Finishing script: \x1b[37m' + process.argv[2] + '\x1b[0m\n');
