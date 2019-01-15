
import * as types from '@babel/types';

// constants
import consts from './constants';

/**
 * Utils service for logging arguments.
 *
 * @private
 * @mixin
 */
const privateApi = {};

/**
 * Utils service for logging arguments sent to logger
 *
 * @mixin
 */
const service = {};

/**
 * Get default arguments for logging
 *
 * @param {LogResourceObj} knownData - object with pre-determined data
 * @return {Array<String>} parameter names that represent a string
 */
privateApi.getDefault = (knownData) => {
  // build first argument, will contain file name, line number and column number
  const firstArg = `[${knownData.source}:${knownData.line}:${knownData.column}]`;

  return [
    types.stringLiteral(firstArg),
    types.stringLiteral(knownData.name),
  ];
};

/**
 * Get function arguments that represent an Identifier
 *
 * @param {Object} path - node path
 * @return {Array<String>} parameter names that represent an Identifier
 */
privateApi.getFunctionArguments = (path) => {
  const {
    node: {
      params = [],
    } = {},
  } = path;

  return params
    .filter((param) => (types.isIdentifier(param)))
    .map((param) => (param.name));
};

/**
 * Get other arguments that should be added when logging
 *
 * @param {Object} path - node path
 * @param {LogResourceObj} knownData - object with pre-determined data
 * @return {Array<String>} parameter names that represent an Identifier
 */
privateApi.getOtherArguments = (path, knownData) => {

  const argumentsToAdd = [];

  const isCatchClause = types.isCatchClause(path);

  if (isCatchClause) {
    // for the catch we need to add the exception
    argumentsToAdd.push(path.node.param.name);
  } else if (knownData.name === consts.MEMBER_EXPRESSION_CATCH) {
    // for a member expression that is catch we should add his arguments
    argumentsToAdd.push(...privateApi.getFunctionArguments(path));
  }

  return argumentsToAdd.map((identifierName) => (types.identifier(identifierName)));
};

/**
 * Get arguments for the logger call that is inserted.
 *
 * @param {Object} path - node path
 * @param {Object} state - node state
 * @param {LogResourceObj} knownData - object with pre-determined data
 * @return {Array} args
 */
service.get = (path, state, knownData) => (
  privateApi.getDefault(knownData)
    .concat(
      privateApi.getOtherArguments(path, knownData)
    )
);

// only for testing
export {
  privateApi,
};

export default service;
