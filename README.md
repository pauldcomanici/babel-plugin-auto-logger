#This is Work In Progress
Plugin can be used as is. More work is needed to have good documentation. 

# babel-plugin-auto-logger
Babel Plugin that will automatically add logging to your existing JS code

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
          "name": "myLogger"
        }
      }
    ]
  ]
}
```