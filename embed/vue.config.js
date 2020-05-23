const path = require('path');

module.exports = {
  publicPath: "./",

  /* the wwt-ts file is so big and bad that eslint basically takes forever to
   * run on it. Besides giving it an eslint-disable marker, we seem to need to
   * set this to get our builds to complete. */
  lintOnSave: false,

  // The engine-vuex library module must depend directly on Vue to get its types
  // for TypeScript. This causes problems, however, because the way this dependency
  // is defined causes Webpack to inclue two copies of Vue in the final bundle,
  // leading to all sorts of problems. This configuration hack fixes the issue.
  // From: https://github.com/vuejs/vue-cli/issues/4271#issuecomment-585299391
  configureWebpack: {
    resolve: {
      alias: {
        vue$: path.resolve('../node_modules/vue/dist/vue.runtime.esm.js'),
      },
    },
  },
};
