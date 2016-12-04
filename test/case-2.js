const assert = require('assert');

assert(process.env.NUM === '2');
assert(process.env.TEST_PARAM === 'special');
assert(process.env.MESSAGE === 'hello');
assert(process.env.STATIC_PARAM === 'static');
