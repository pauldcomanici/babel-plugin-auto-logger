
import * as types from '@babel/types';

// services
import loggingArguments from './arguments';
import loggingData from './logging';
import sourceFile from './source-file';
// constants
import consts from './constants';

/**
 * Utils service for the plugin.
 *
 * @private
 * @mixin
 */
const privateApi = {};

/**
 * Utils service for the plugin.
 *
 * @mixin
 */
const service = {};

/**
 * Test based on a bodyNode if logging was added
 *
 * @param {Object} bodyNode - node path for an item from the body
 * @param {Object} state - node state
 * @return {Boolean} hasLogging
 */
privateApi.hasLogging = (bodyNode, state) => {
  const isExpressionStatement = types.isExpressionStatement(bodyNode);

  if (!isExpressionStatement) {
    return false;
  }

  const expression = bodyNode.expression;
  const isCallExpression = types.isCallExpression(expression);

  if (!isCallExpression) {
    return false;
  }

  const callee = expression.callee;
  const isMemberExpression = types.isMemberExpression(callee);

  if (!isMemberExpression) {
    return false;
  }

  const calleeObject = callee.object;
  const isIdentifier = types.isIdentifier(calleeObject);

  if (!isIdentifier) {
    return false;
  }

  const loggerName = service.getLoggerName(state);

  return calleeObject.name === loggerName;

};

/**
 * Test if in the provided path we can add logging. It will check if logger wasn't added.
 *
 * @param {Object} path - node path
 * @param {Object} state - node state
 * @return {Boolean} canBeAdded
 */
privateApi.canBeAdded = (path, state) => {
  const isBlockStatement = types.isBlockStatement(path);

  if (!isBlockStatement) {
    // logger can be added only if is a block statement
    return false;
  }

  const blockBody = path.node.body;

  const foundLogger = blockBody.find((bodyNode) => privateApi.hasLogging(bodyNode, state));

  return !foundLogger;
};

/**
 * Get path where the logger should be inserted
 *
 * @param {Object} path - node path
 * @return {Object|undefined} insertPath - path
 */
privateApi.getPathForInsert = (path) => {
  // logger is inserted in body
  const insertPath = path.get('body');

  const isBlockStatement = types.isBlockStatement(insertPath);

  if (isBlockStatement) {
    // logger will be inserted only if is a block statement
    return insertPath;
  }

  const isArrowFunctionExpression = types.isArrowFunctionExpression(insertPath);

  if (isArrowFunctionExpression) {
    // for arrow function check inside maybe we find a block statement
    // Note: we ignore functions that just return data (example: `fn = () => (2)`)
    return privateApi.getPathForInsert(insertPath);
  }

  return undefined;
};

/**
 * Get path location. It will return an object with line and column.
 *
 * @param {Object} path - node path
 * @return {Object} locationObj
 */
privateApi.getLocation = (path) => {
  const {
    loc: {
      start: {
        column,
        line,
      } = {},
    } = {},
  } = path.node || {};

  return {
    column,
    line,
  };
};

/**
 * Get the name for the path where we want to call logger.
 * If the node under path represents a function will return function name
 *
 * @param {Object} path - node path
 * @return {String|undefined} name - function name if found
 */
privateApi.getName = (path) => {

  const isCatchClause = types.isCatchClause(path);

  if (isCatchClause) {
    return 'catchClause';
  }

  const {
    container = {},
    node = {},
    parent = {},
  } = path;

  if (node.id) {
    // function declaration
    return node.id.name;
  }

  if (container.id) {
    // variable declaration (value is a function)
    // example:
    //    var myFn = () => {/* code */}
    //    const myFn = () => {/* code */}
    //    let myFn = () => {/* code */}
    //    let myFn = function () {/* code */}
    return container.id.name;
  }

  if (parent.left && parent.left.property) {
    // expression declaration (value is a function)
    // example:
    //    obj.prop = () => {/* code */}
    //    obj.prop = function () {/* code */}
    return parent.left.property.name;
  }

  if (parent.left && parent.left.name) {
    // expression declaration (value is a function)
    // example:
    //    myFn = () => {/* code */}
    //    myFn = function () {/* code */}
    return parent.left.name;
  }

  const {
    key: nodeKey = {},
  } = node;

  if (nodeKey && nodeKey.name) {
    // object method (key is the function name)
    // example:
    //    const obj = {keyFnAuto() {/* code */},}
    //    class MyClass {
    //      methodName() {/* code */}
    //    }
    return nodeKey.name;
  }

  const {
    key: parentKey = {},
  } = parent;

  if (parentKey && parentKey.name) {
    // object method (value is a function)
    // example:
    //    const obj = {keyFnArrow: () => {/* code */},}
    //    const obj = {keyFn: function () {/* code */},}
    //    class MyClass {
    //      methodNameInst = () => {/* code */}
    //      methodFnNameInst = function () {/* code */}
    //    }
    return parentKey.name;
  }

  const {
    callee: {
      property,
    } = {},
  } = parent;

  if (property && property.name === 'catch') {
    // method expression, part of call expression
    // example:
    //    promiseObj.catch((reason) => {/*code*/})
    return consts.MEMBER_EXPRESSION_CATCH;
  }

  if (path.inList && Number.isInteger(path.key)) {
    // anonymous function that is an item of Array
    // example:
    //    arr = [(p) => {/*code*/}]
    return `array-item-${path.key}`;
  }

  return undefined;
};

/**
 * Get default log level that should be used.
 * Uses method from `error` for `try...catch` or `Promise.catch()`, otherwise will uses method from `log`.
 *
 * @param {Object} path - node path
 * @param {Object} state - node state
 * @param {PluginConfigObj} state.babelPluginLoggerSettings - settings for the plugin
 * @param {LogResourceObj} knownData - object with pre-determined data
 * @return {String} logLevelName
 */
privateApi.getDefaultLogLevelName = (path, state, knownData) => {
  const {
    levelForMemberExpressionCatch,
    levelForTryCatch,
  } = state.babelPluginLoggerSettings.loggingData;

  const isCatchClause = types.isCatchClause(path);
  if (isCatchClause) {
    return levelForTryCatch;
  }

  if (knownData.name === consts.MEMBER_EXPRESSION_CATCH) {
    return levelForMemberExpressionCatch;
  }

  const levels = loggingData.getLevels();

  return levels.log;
};

/**
 * Get log level that should be used.
 * Takes in consideration default logging and if we have something specific
 *  for function name matcher or file name matcher.
 *
 * @param {Object} path - node path
 * @param {Object} state - node state
 * @param {PluginConfigObj} state.babelPluginLoggerSettings - settings for the plugin
 * @param {LogResourceObj} knownData - object with pre-determined data
 * @return {String} logLevel
 */
privateApi.getLogLevel = (path, state, knownData) => {
  const {
    levels,
  } = state.babelPluginLoggerSettings.loggingData;

  const logLevelName = privateApi.getDefaultLogLevelName(path, state, knownData);
  // TODO: source matching & method name matching for this level of logging

  return levels[logLevelName].methodName;
};

/**
 * Insert logging.
 *
 * @param {Object} path - node path
 * @param {Object} insertPath - node path where we will add logging
 * @param {Object} state - node state
 * @param {LogResourceObj} partialData - object with pre-determined data
 * @return {undefined}
 */
privateApi.insertLogging = (path, insertPath, state, partialData) => {
  const source = sourceFile.get(state);
  const knownData = {
    column: partialData.column,
    line: partialData.line,
    name: partialData.name,
    source,
  };

  insertPath.unshiftContainer(
    'body',
    types.expressionStatement(
      types.callExpression(
        types.memberExpression(
          types.identifier(service.getLoggerName(state)),
          types.identifier(privateApi.getLogLevel(path, state, knownData))
        ),
        loggingArguments.get(
          path,
          state,
          knownData
        )
      )
    )
  );
};

/**
 * Get the name of the logger that will be used at import and later on to call methods from it.
 *
 * @param {Object} state - node state
 * @return {String} loggerName
 */
service.getLoggerName = (state) => (state.babelPluginLoggerSettings.loggingData.name);

/**
 * Get logger source that will be used for import
 *
 * @param {Object} state - node state
 * @return {String} loggerSource
 */
service.getLoggerSource = (state) => (state.babelPluginLoggerSettings.loggingData.source);

/**
 * Determine if we can work with provided path and state.
 * From path we are interested to work with a node that it's not generated.
 * From state we are interested to work with a file that represents a source and is not excluded.
 *
 * @param {Object} path - node path
 * @param {Object} state - node state
 * @return {Boolean} isValid
 */
service.isValidPathAndState = (path, state) => {

  if (path.node._generated) {
    // if this node was generated ignore it
    return false;
  }

  const {
    filename,
  } = state.file.opts;

  const {
    sourceMatcher,
    sourceExcludeMatcher,
  } = state.babelPluginLoggerSettings;

  const allowFromSource = sourceMatcher.test(filename);
  if (!allowFromSource) {
    // if file does not match sources => stop
    return false;
  }

  const excludeFromSource = sourceExcludeMatcher.test(filename);

  // if file is excluded from sources => stop
  return !excludeFromSource;
};

/**
 * Add logger to the source code.
 * Source code can represent a function or catch.
 * It will determine:
 *  * the name (usually function name) for the provided path
 *  * location of the code
 *  * block statement path
 * If data couldn't be determined at any step it will stop.
 * With the block statement path will verify if the call to logger was not added and if it wasn't added it will add it.
 *
 * @param {Object} path - node path
 * @param {Object} state - node state
 * @return {Boolean} loggerAdded - false will be returned if nothing is done
 */
service.addLogger = (path, state) => {

  const name = privateApi.getName(path);

  if (!name) {
    return false;
  }

  const insertPath = privateApi.getPathForInsert(path);

  if (!insertPath) {
    // if we couldn't determine the path where logger should be added => stop
    return false;
  }

  const {
    column,
    line,
  } = privateApi.getLocation(insertPath);

  const sourceCode = (column !== undefined && line !== undefined);

  if (!sourceCode) {
    // if we couldn't determine line and column that code was generated => stop
    return false;
  }

  const loggerCanBeAdded = privateApi.canBeAdded(insertPath, state);

  if (loggerCanBeAdded) {
    privateApi.insertLogging(
      path,
      insertPath,
      state,
      {
        column,
        line,
        name,
      }
    );

    return true;
  }

  return false;
};

// only for testing
export {
  privateApi,
};

export default service;
