
// constants
import consts from './constants';

/**
 * Private API for logging service.
 *
 * @private
 * @mixin
 */
const privateApi = {};

/**
 * Service that manages how logging will be done.
 *
 * @mixin
 */
const service = {};

/**
 * All log levels
 *
 * @default
 * @type {Object}
 */
privateApi.logLevels = {
  debug: 'debug',
  error: 'error',
  info: 'info',
  log: 'log',
  warn: 'warn',
};

/**
 * Supported log levels ordered by priority
 *
 * @default
 * @type {Array<String>}
 */
privateApi.supportedLogLevels = [
  privateApi.logLevels.error,
  privateApi.logLevels.warn,
  privateApi.logLevels.info,
  privateApi.logLevels.debug,
  privateApi.logLevels.log,
];

/**
 * Get matcher.
 * If it has truthy value as string returns RegExp based on it, if not return empty object.
 *
 * @param {String} [matcher] - value for the matcher
 * @return {RegExp|String} updatedMatcher
 */
privateApi.getMatcher = (matcher) => (
  (matcher && typeof matcher === 'string' && new RegExp(matcher)) || ''
);

/**
 * Prepare logging level settings.
 *
 * @param {String} logLevel - log level
 * @param {LoggerLevelObj} logLevelData - logging level options
 * @return {LoggerLevelObj} options - object with options for the provided log level
 */
privateApi.getLogLevelData = (logLevel, logLevelData) => {
  const options = {};

  // log level method name (property from logger that is a function)
  // if is not provided will use logLevel
  options.methodName = logLevelData.methodName || logLevel;
  // source file matcher
  options.matchSource = logLevelData.matchSource || '';
  // source file matcher as RegExp
  options.matchSourceRegExp = privateApi.getMatcher(options.matchSource);
  // function name matcher
  options.matchFunctionName = logLevelData.matchFunctionName || '';
  // function name matcher as RegExp
  options.matchFunctionNameRegExp = privateApi.getMatcher(options.matchFunctionName);

  return options;
};

/**
 * Prepare logging levels.
 * It will check every log level and prepared settings for it.
 *
 * @param {Object} loggingLevels - logging levels
 * @return {Object} options - object with options for the logging levels
 */
privateApi.getLoggingLevels = (loggingLevels) => {
  const options = {};

  privateApi.supportedLogLevels.forEach((logLevel) => {
    const logLevelData = loggingLevels && loggingLevels[logLevel] || {};
    options[logLevel] = privateApi.getLogLevelData(logLevel, logLevelData);
  });

  return options;
};

/**
 * Get log level for catch block or when catch is a member of expression.
 * If log level provided is valid will use it, if not will use default (error).
 *
 * @param {String} [levelForCatch] - logging level received as option
 * @return {String} levelForCatch - level that will be used for specific catch case
 */
privateApi.getLogLevelForCatch = (levelForCatch) => (
  privateApi.supportedLogLevels.includes(levelForCatch) ?
    levelForCatch : privateApi.logLevels.error
);

/**
 * Prepare options for the logger.
 * It will set the source, name, map for levels
 *
 * @param {LoggerDataObj} loggingData - logging data
 * @return {Object} options - object with options for logging data
 */
service.getOptions = (loggingData) => {
  const options = {};
  const {
    levelForMemberExpressionCatch,
    levelForTryCatch,
    levels,
    name,
    source,
  } = loggingData || {};

  options.name = name || consts.LOGGER_API;
  if (options.name === consts.LOGGER_API) {
    // when we are using default, we shouldn't have source
    options.source = '';
  } else {
    options.source = source || '';
  }
  options.levelForMemberExpressionCatch = privateApi.getLogLevelForCatch(levelForMemberExpressionCatch);
  options.levelForTryCatch = privateApi.getLogLevelForCatch(levelForTryCatch);
  options.levels = privateApi.getLoggingLevels(levels);

  return options;
};

/**
 * Get log levels
 *
 * @return {Object} logLevels
 */
service.getLevels = () => (
  privateApi.logLevels
);

/**
 * Get log levels by priority
 *
 * @return {Array} logLevels
 */
service.getLevelsByPriority = () => (
  privateApi.supportedLogLevels
);

// only for testing
export {
  privateApi,
};

export default service;
