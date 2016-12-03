#!/usr/bin/env node

var join = require('path').join;
var fullScriptsPath = join(process.cwd(), 'scripts.json');
var run = require('./lib/run');
var Pattern = require('./lib/Pattern');
var err = require('./lib/logger').err;
var exit = require('./lib/logger').exit;
var log = require('./lib/logger').log;
var m = require('./lib/logger').modifiers;

var commandName = process.argv[2];

try {
    var scripts = require(fullScriptsPath);
} catch(e) {
    exit(e.toString());
}

!commandName && exit('No script name presented!');

for(var i = 0; i < scripts.length; i++) {
    var pattern = new Pattern(scripts[i]);

    if (pattern.matches(commandName)) {
        log('Starting script: ');
        log(commandName + '\n', m.FgRed);
        run(pattern.getDataForExecution(), function (error, stdout, stderr) {
            process.stderr.write(stderr);
            process.stdout.write(stdout);
            error !== null && exit('runtime error: ' + error);
        });
        log('Finishing script: ');
        log(commandName + '\n', m.FgRed);
        break;
    }

    if (i + 1 === scripts.length) {
        err('No pattern for such script: ');
        exit(commandName + '\n', m.FgRed);
    }
}
