var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require("html-webpack-plugin");
var ReactRootPlugin = require("html-webpack-react-root-plugin");

var DEV_SERVER = {
  watchOptions: {
    ignored: /node_modules/,
    poll: true
  },
  historyApiFallback: true,
  overlay: true
}

module.exports = {
  cache: true,
  devServer: DEV_SERVER,
  devtool: "eval-source-map",
  entry: [
    './client/index'
  ],
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].[hash].js',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel-loader'],
      exclude: /node_modules/,
      include: path.join(__dirname, 'client')
    },
    {
      test: /\.css$/,
      use: [
        { loader: "style-loader" },
        { loader: "css-loader" }
      ]
    },
  {
    test: /\.jpg$/,
    use: [
      { loader: "copy-loader" }
    ]
  }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      minChunks: (module) => module.context && module.context.indexOf("node_modules") !== -1,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "manifest",
    }),
    new HtmlWebpackPlugin({
      title: "Bibloba"
    }),
    new ReactRootPlugin({
      tagName: "div",
      tagId: "app"
    })
  ]
};