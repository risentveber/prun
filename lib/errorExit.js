module.exports = function errorExit(message) {
    process.stderr.write('\x1b[31mCRITICAL ERROR: ' + message + '\x1b[0m\n');
    process.exit(1);
};
