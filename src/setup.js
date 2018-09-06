
// services
import options from './options';

/**
 * Setup service for the plugin
 *
 * @mixin
 */
const service = {};

/**
 * Setup plugin (init).
 * It will prepare options, taking in consideration provided options and
 * will expose them on the scope instance to be available later by any other method.
 * Note: this is written using functionExpression to have access to `this`.
 *
 * @return {undefined}
 */
service.pre = function () {
  this.babelPluginLoggerSettings = options.prepare(this.opts);
};

/**
 * Setup plugin (cleanup).
 * It will clear settings that have been set initially.
 * Note: this is written using functionExpression to have access to `this`.
 *
 * @return {undefined}
 */
service.post = function () {
  // I do not like `delete`
  this.babelPluginLoggerSettings = undefined;
};

export default service;
