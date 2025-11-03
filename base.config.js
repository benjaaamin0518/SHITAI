const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const path = require("path");

const BUILD_ROOT = path.join(__dirname, "./dist");
const SRC_ROOT = path.join(__dirname, "./");

module.exports = {
  context: SRC_ROOT,
  entry: path.resolve("src/backend", "server.ts"),
  externals: [nodeExternals()],
  output: {
    filename: "server.js",
    path: BUILD_ROOT,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: "ts-loader",
        options: {
          configFile: "tsconfig.json",
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts"],
    alias: {
      "@": path.join(__dirname, "/src/"),
    },
  },
};
