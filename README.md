<p align="center">
  <a href="https://travis-ci.org/darkyndy/babel-plugin-auto-logger">
    <img alt="Travis Status" src="https://travis-ci.org/darkyndy/babel-plugin-auto-logger.svg?branch=master">
  </a>
  <a href="https://codecov.io/gh/darkyndy/babel-plugin-auto-logger">
    <img alt="Coverage Status" src="https://codecov.io/gh/darkyndy/babel-plugin-auto-logger/branch/master/graph/badge.svg" />
  </a>
</p>

# babel-plugin-auto-logger
Babel Plugin that will automatically add logging to your existing JS code.

Are you tired of adding logging calls over and over again?
This plugin will automatically do it for you.

There are 2 use-cases covered by default:
1. logging error
    - uses `error` method
    - for [try...catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)
    - for [Promise.catch()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)
2. logging verbose
    - uses `log` method
    - every case that is does not log error and is not an arrow function that has only return

## Installation
```sh
npm install --save-dev babel-plugin-auto-logger
```
Or if you are using [yarn](https://yarnpkg.com/en/)
```sh
yarn add --dev babel-plugin-auto-logger
```

## Usage

### Via `.babelrc` (Recommended)
```json
{
  "plugins": ["babel-plugin-auto-logger"]
}
```

### Via CLI
```sh
node node_modules/.bin/babel --plugins babel-plugin-auto-logger script.js
```

### Via Node API
```javascript
require("@babel/core").transform("code", {
  plugins: ["babel-plugin-auto-logger"]
});
```

## Configuration - Advanced usage scenarios
Bellow examples are for `.babelrc`, [read more...](https://babeljs.io/docs/en/plugins/#plugin-options)

### Options
Abstract example with all plugin options:
```json
{
  "loggingData": {
    "levelForTryCatch": "error",
    "levelForMemberExpressionCatch": "error",
    "levels": {
      "debug": {
        "methodName": "myDebug"
      },
      "error": {
        "methodName": "myError"
      },
      "info": {
        "methodName": "myInfo"
      },
      "log": {
        "methodName": "myLog"
      },
      "warn": {
        "methodName": "myWarn"
      }
    },
    "name": "myLogger",
    "source": "path/to/file"
  },
  "sourceMatcher": "RegExp",
  "sourceExcludeMatcher": "RegExp"
}
```

#### loggingData.levelForTryCatch
- Data type: String
- Default value: `error`
- Details:
  - controls what log level will be used inside the catch block

#### loggingData.levelForMemberExpressionCatch
- Data type: String
- Default value: `error`
- Details:
  - controls what log level will be used inside the block for catch that is a member of an expression (e.g. Promise.catch())

#### loggingData.levels
- Data type: Object
- Default value:
  ```text
  {
    debug: {
      methodName: 'debug',
    },
    error: {
      methodName: 'error',
    },
    info: {
      methodName: 'info',
    },
    log: {
      methodName: 'log',
    },
    warn: {
      methodName: 'warn',
    },
  }
  ```
- Details:
  - logging levels are based on [console API](https://developer.mozilla.org/en-US/docs/Web/API/console)
    - debug
    - error
    - info
    - log
    - warn
  - allows you to use your own method names for logging API
    > Tip: If you want all logging levels to use same method, just set same value for `methodName`


##### loggingData.levels.logLevel
- Data type: Object
- Default value: specific for every log level
- Details:
  - allows you to use your own method name for logging API 

#### loggingData.name
- Data type: String
- Default value: `'console'`
- Details:
  - usually used in combination with `loggingData.source`
  - represents the name for default import if `loggingData.source` has truthy value or the name of a service that is globally available

#### loggingData.source
- Data type: String
- Default value: `''` (empty string)
- Details:
  - usually used in combination with `loggingData.name`
  - when it has truthy value it can represent the path or the npm package name to the service that will be imported

#### sourceMatcher
- Data type: String or Array of Strings
- Default value:
  ```text
  [
    '.*js(x)?$',
  ]
  ```
  source file is any file that ends in `js` or `jsx` (e.g.: `utils.js`, `view.jsx`)
- Details:
  - allows you to configure what will be considered as source code
  - every String represents a RegExp

#### sourceExcludeMatcher
- Data type: String or Array of Strings
- Default value:
  ```text
  [
    '__fixtures__',
    '__mocks__',
    '__tests__',
    '__snapshots__',
    'node_modules',
  ]
  ```
  files that will be excluded are the ones that contain in the path above strings
- Details:
  - allows you to configure what will be excluded from source code
  - every String represents a RegExp
  - if the pattern matches both the inclusion and exclusion then the pattern will be excluded


### Control logging API
By default plugin will insert logs based on [console API](https://developer.mozilla.org/en-US/docs/Web/API/console)

If you want to control the API (service) that should be used, you will use `name` property from `loggingData` object. Example:
```json
{
  "plugins": [
    [
      "babel-plugin-auto-logger",
      {
        "loggingData": {
          "name": "myLogger",
          "source": "path/to/file"
        }
      }
    ]
  ]
}
```
> Based on above config, code that exists under path `src/code.js`:
>  ```javascript
>  function x(a, b) {
>    return a + b;
>  }
>  ```
>  will become:
>  ```javascript
>  import myLogger from "path/to/file";
>   
>  function x(a, b) {
>    myLogger.log("[src/code.js:1:17]", "x");
>    return a + b;
>  }
>  ```

## Coming soon
- Ability to use specific logging method depending on the function name
- Ability to use specific logging method depending on the file path
