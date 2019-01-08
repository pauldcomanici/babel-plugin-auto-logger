/**
 * Type definition
 */

/**
 * Plugin settings for log level
 *
 * @typedef {Object} LoggerLevelObj
 * @property {String} methodName - property name for logger object that is a function and will be called for this log level
 * @property {String} fileMatcher - regular expression for sources that should have current log level
 * @property {Boolean} fileMatchOverwritePriority - flag to know if there is a match based on file => this log level should overwrite higher priority log level
 * @property {String} functionNameMatcher - regular expression for function name that should have current log level
 * @property {Boolean} functionNameMatchOverwritePriority - flag to know if there is a match based on function name => this log level should overwrite higher priority log level
 */

/**
 * Plugin Settings for levels for logging data
 *
 * @typedef {Object} LoggerLevelsObj
 * @property {LoggerLevelObj} debug - debug level settings
 * @property {LoggerLevelObj} error - error level settings
 * @property {LoggerLevelObj} info - info level settings
 * @property {LoggerLevelObj} log - log level settings
 * @property {LoggerLevelObj} warn - warn level settings
 */

/**
 * Plugin Settings for logging data
 *
 * @typedef {Object} LoggerDataObj
 * @property {String} [levelForMemberExpressionCatch] - logging level that should be used when `catch` is a member of an expression (e.g. Promise.catch)
 * @property {String} [levelForTryCatch] - logging level that should be used in `catch` block
 * @property {String} [source] - logger source, npm package
 * @property {String} [name='console'] - logger name, name for the import, if is not specified or it is 'console' no import will be made
 * @property {LoggerLevelsObj} levels - object with log levels
 */

/**
 * Plugin Settings
 *
 * @typedef {Object} PluginConfigObj
 * @property {RegExp} sourceMatcher - regular expression for source matching
 * @property {RegExp} sourceExcludeMatcher - regular expression for exclude source matching
 * @property {LoggerDataObj} loggingData - object with logging data
 */

/**
 * Plugin known data that is sent as parameter
 *
 * @typedef {Object} LogResourceObj
 * @property {Number} column - column number where the source code is located
 * @property {Number} line - line number where the source code is located
 * @property {String} name - name (usually the function name)
 * @property {String} source - file name, may including path
 */
