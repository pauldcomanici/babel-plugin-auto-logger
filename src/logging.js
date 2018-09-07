
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
 * Get supported log levels by the plugin
 *
 * @default
 *
 * @return {Array<String>} defaultLogLevels
 */
privateApi.getSupportedLogLevels = () => ([
  'debug',
  'error',
  'info',
  'log',
  'warn',
]);

/**
 * Prepare logging level settings.
 *
 * @param {String} logLevel - log level
 * @param {LoggerLevelObj} logLevelData - logging level options
 * @return {Object} options - object with options for the provided log level
 */
privateApi.getLogLevelData = (logLevel, logLevelData) => {
  const options = {};

  // log level method name (property from logger that is a function)
  // if is not provided will use logLevel
  options.methodName = logLevelData.methodName || logLevel;
  // TODO: source matching & method name matching for this level of logging (next version)

  return options;
};

/**
 * Prepare logging levels.
 * It will check every log level and prepared settings for it.
 *
 * @param {Object} loggingLevels - logging levels
 * @return {Object} options - object with options got the logging levels
 */
privateApi.getLoggingLevels = (loggingLevels) => {
  const options = {};

  const supportedLogLevels = privateApi.getSupportedLogLevels();

  supportedLogLevels.forEach((logLevel) => {
    const logLevelData = loggingLevels && loggingLevels[logLevel] || {};
    options[logLevel] = privateApi.getLogLevelData(logLevel, logLevelData);
  });

  return options;
};

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
  options.levels = privateApi.getLoggingLevels(levels);

  return options;
};



// only for testing
export {
  privateApi,
};

export default service;
