#!/usr/bin/env node

var join = require('path').join;
var fullScriptsPath = join(process.cwd(), 'scripts.json');
var errorExit = require('./lib/errorExit');
var run = require('./lib/run');
var commandName = process.argv[2];

try {
    var scripts = require(fullScriptsPath);
} catch(e) {
    errorExit(e.toString());
}

!commandName && errorExit('No script name presented!');

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

for(var i = 0; i < scripts.length; i++) {
    pattern = buildPattern(scripts[i].name);

    var match, data = [];
    if (match = pattern.regexp.exec(commandName)) {
        for(var p=0; p < pattern.params.length; p++) {
           data[pattern.params[p]] = match[p + 1];
        }
        scripts[i] = JSON.parse(TemplateEngine(JSON.stringify(scripts[i]), data));
        process.stdout.write('Starting script: \x1b[37m' + commandName + '\x1b[0m\n');
        run(scripts[i], function (error, stdout, stderr) {
            process.stderr.write(stderr);
            process.stdout.write(stdout);
            if(error !== null) {
                errorExit('runtime error: ' + error);
            }
        });
        process.stdout.write('Finishing script: \x1b[37m' + commandName + '\x1b[0m\n');
        break;
    } else {
        //console.log('bad', commandName)
    }

    if (i + 1 === scripts.length) {
        errorExit('No pattern for such script: \x1b[37m' + commandName + '\x1b[0m');
    }
}

function TemplateEngine(tpl, data) {
    var re = /<%([^%>]+)?%>/, match;
    while(match = re.exec(tpl)) {
        tpl = tpl.replace(match[0], data[match[1]])
    }
    return tpl;
}

