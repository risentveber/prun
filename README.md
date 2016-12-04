[![NPM](https://nodei.co/npm/prun.png)](https://npmjs.org/package/prun)

[![Build Status](https://travis-ci.org/risentveber/prun.svg?branch=master)](https://travis-ci.org/risentveber/prun)

## Comfortable script runner with simple pattern system

### Installation
```bash
   npm install prun
```
This package is tested on node >= 4.0.

### Get started

Scripts defenitions stored in `scripts.json` at root directory via array of "script" objects.

They support simple pattern system like `<%param%>` in the name of script to be executed.
```json
[
  {
    "name": "command:<%param%>",
    "command": "echo <%param%> $SOME_ENV_VARIABLE",
    "env": {
      "SOME_ENV_VARIABLE": "env<%param%>"
    }
  }
]
```
For example:
```bash
   prun comand:test
```
results to be executed
```bash
   echo test envtest
```

Priority of matched command is defined by order of command pattern in `scripts.json`: the 
first matched is executed.