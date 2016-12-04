const assert = require('assert');

assert(process.env.NUM === '1');
assert(process.env.TEST_PARAM === 'default');
assert(process.env.MESSAGE === 'hello');
assert(process.env.STATIC_PARAM === 'static');
