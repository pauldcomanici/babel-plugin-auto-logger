# This is Work In Progress
Plugin can be used as is. More work is needed to have good documentation. 

# babel-plugin-auto-logger
Babel Plugin that will automatically add logging to your existing JS code.

Are you tired of adding logging calls over and over again?
This plugin will automatically do it for you.

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
    "name": "myLogger",
    "source": "path/to/file"
  },
  "sourceMatcher": "RegExp",
  "sourceExcludeMatcher": "RegExp"
}
```

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
