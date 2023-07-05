const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { DefinePlugin, ProvidePlugin } = require('webpack');
const { dev, envConfig, clientVersion } = require('./build_util');
require('dotenv').config();

const BUILD_DIR = path.resolve(__dirname, 'build');

module.exports = {
  mode: dev ? 'development' : 'production',
  devtool: dev ? 'eval-source-map' : 'source-map',
  entry: path.resolve(__dirname, 'src', 'index.js'),
  output: {
    path: BUILD_DIR,
    publicPath: '/',
    filename: dev ? 'bundle.js' : '[contenthash].bundle.js',
  },

  devServer: {
    host: '0.0.0.0',
    port: '3000',
    historyApiFallback: true,
    open: true,
    hot: true,
    liveReload: true,
    watchFiles: ['src/**/*'],
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    roots: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'node_modules')],
  },

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
      }),
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.ejs'),
      title: 'Cogent Labs',
    }),
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(dev ? 'development' : 'production'),
      'CLIENT_VERSION': JSON.stringify(clientVersion),
      'ENV_CONFIG': JSON.stringify(envConfig),
      'API_HOST': JSON.stringify(process.env.API_HOST),
    }),
    new ProvidePlugin({
      _: 'lodash',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
    }),
  ],

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { modules: { mode: 'icss' } } },
          'sass-loader',
        ],
      },

      // Language files
      {
        test: /\.json$/,
        include: [path.resolve(__dirname, 'src/lang')],
        type: 'asset/resource',
        generator: { filename: 'lang/[name].[contenthash][ext]' },
      },

      // Assets
      {
        test: /\.(png|svg|ico|mp3|ogg|woff|woff2|eot|ttf)$/i,
        include: [path.resolve(__dirname, 'src/assets')],
        type: 'asset/resource',
        generator: { filename: 'assets/[name][ext]' },
      },
    ],
  },
};
