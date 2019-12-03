
/**
 * Service for source-file manipulation.
 *
 * @mixin
 */
const service = {};

/**
 * Get source file path
 *
 * @param {Object} state - node state
 * @return {String} path to the source file where we will add logging
 */
service.get = (state) => {
  const {
    parserOpts,
    root,
    sourceFileName,
    sourceMapTarget,
  } = state.file.opts;

  let sourceFile = sourceMapTarget || sourceFileName ||
    (parserOpts && (parserOpts.sourceMapTarget || parserOpts.sourceFileName));

  if (sourceFile && root) {
    // extract root path from source path
    sourceFile = sourceFile.replace(root, '');
  }

  return sourceFile || '';
};

export default service;
