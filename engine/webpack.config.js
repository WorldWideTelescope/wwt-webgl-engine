const path = require("path");
const webpack = require("webpack");

var config = {
    entry: "./esm/index.js",
    output: {
        path: path.resolve(__dirname, "src"),
        globalObject: "this",
        library: {
            name: "wwtlib",
            type: "umd"
        }
    },
    plugins: [
      // Strips the 'node:' protocol prefix so Webpack can match standard fallbacks
      new webpack.NormalModuleReplacementPlugin(
        /^node:/,
        (resource) => {
          resource.request = resource.request.replace(/^node:/, '');
        }
      )
    ],
};

module.exports = (_env, argv) => {
    if (argv.mode === "development") {
        config.devtool = "source-map";
        config.output.filename = "index.js";
    }

    if (argv.mode === "production") {
        config.output.filename = "index.min.js";
    }

    return config;
};
