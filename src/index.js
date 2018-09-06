
import {declare} from '@babel/helper-plugin-utils';

// services
import setup from './setup';
import visitors from './visitors';

/**
 * Babel plugin that will automatically add logging.
 * Used visitors:
 *  - Program
 *  -- needed to insert import declaration
 *  - Function
 *  -- needed to insert logging call expression
 *  -- alias for FunctionDeclaration, FunctionExpression, ArrowFunctionExpression, ObjectMethod and ClassMethod
 *  - CatchClause
 *  -- needed to insert logging call expression
 *
 * @param {Object} api - babel api normalization
 *
 * @return {Object} pluginData
 */
function babelPluginAutoLogger(api) {
  api.assertVersion(7);

  // return plugin data
  return {
    name: 'babel-plugin-auto-logger',
    pre: setup.pre,
    visitor: {
      Program: visitors.program,
      'Function|CatchClause': visitors.insertExpressionStatement,
    },
    post: setup.post,
  };

}

// only for testing
export {babelPluginAutoLogger};

export default declare(babelPluginAutoLogger);
