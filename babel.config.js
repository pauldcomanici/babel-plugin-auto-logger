"use strict";

module.exports = function(api) { // eslint-disable-line no-undef
  api.cache.never();

  const envConfig = {
    targets: {
      node: true,
    },
  };

  return {
    presets: [
      [
        '@babel/preset-env',
        envConfig,
      ],
    ],
  };
};
