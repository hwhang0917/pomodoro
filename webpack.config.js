const path = require('path');
const webpack = require('webpack');

// Webpack Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// Directories
const appSrc = path.join(__dirname, 'src');
const appBuild = path.join(__dirname, 'build');
const appAssets = path.join(appSrc, 'assets');
const appHtml = path.join(appSrc, 'index.html');
const appIndex = path.join(appSrc, 'index.ts');

module.exports = (webpackEnv) => {
  const DEV = 'development';
  const PROD = 'production';
  // Parse webpack envrionment
  const isEnvDev = webpackEnv.development ? true : false;
  return {
    mode: isEnvDev ? DEV : PROD,
    entry: appIndex,
    output: {
      path: appBuild,
      filename: isEnvDev
        ? 'static/js/bundle.js'
        : 'static/js/[name].[contenthash:8].js',
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
    module: {
      rules: [
        {
          test: /\.ts?$/,
          exclude: /node_modules/,
          use: [
            'cache-loader',
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: isEnvDev,
              },
            },
          ],
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    plugins: [
      new ProgressBarPlugin(),
      new CopyWebpackPlugin({
        patterns: [{ from: appAssets, to: 'assets' }],
      }),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: appHtml,
        filename: 'index.html',
        inject: 'body',
      }),
      new WebpackManifestPlugin(),
    ],
    cache: {
      type: isEnvDev ? 'memory' : 'filesystem',
    },
    devServer: {
      port: 3000,
      contentBase: appSrc,
      open: true,
      overlay: true,
      stats: 'errors-only',
    },
    devtool: isEnvDev ? 'cheap-module-source-map' : 'source-map',
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
  };
};
