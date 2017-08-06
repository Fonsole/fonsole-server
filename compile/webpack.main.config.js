

process.env.BABEL_ENV = 'main';

const path = require('path');
const { dependencies, devDependencies } = require('../package.json');
const webpack = require('webpack');

const BabiliWebpackPlugin = require('babili-webpack-plugin');

const mainConfig = {
  entry: {
    main: path.join(__dirname, '../src/main/index.js'),
  },
  externals: [
    ...Object.keys(dependencies || {}),
    ...Object.keys(devDependencies || {}),
  ],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: {
          loader: 'eslint-loader',
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['stage-0'],
          },
        },
      },
    ],
  },
  output: {
    filename: 'index.js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist/main'),
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  resolve: {
    alias: {
      '=': path.join(__dirname, '../src/shared'),
    },
    extensions: ['.js', '.json'],
  },
  target: 'node',
  devtool: '#source-map',
};

/**
 * Adjust mainConfig for development settings
 */
if (process.env.NODE_ENV !== 'production') {
  mainConfig.plugins.push(...[
    new webpack.HotModuleReplacementPlugin(),
  ]);
}

/**
 * Adjust mainConfig for production settings
 */
if (process.env.NODE_ENV === 'production') {
  mainConfig.plugins.push(...[
    new BabiliWebpackPlugin({
      // removeConsole: true,
      removeDebugger: true,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
  ]);
}

module.exports = mainConfig;
