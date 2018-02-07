const path = require('path')
const childProcess = require('child_process');
const spawn = childProcess.spawn;

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const port = process.env.PORT || 8080;
const publicPath = `http://localhost:${port}/dist`;

const commonConfig = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        enforce: 'pre',
        loader: 'tslint-loader',
        options: {
          typeCheck: true,
          emitErrors: true
        }
      },
      {
        test: /\.tsx?$/,
        loader: ['babel-loader', 'ts-loader']
      }
    ]
  },
  node: {
    __dirname: false
  },
  resolve: {
    extensions: ['.js', '.ts', '.json']
  },
  devServer: {
    publicPath: publicPath,
    before() {
      if (process.env.HOT) {
        spawn(
          'npm',
          ['run', 'dev-electron'],
          { shell: true, env: process.env, stdio: 'inherit' }
        )
          .on('close', code => process.exit(code))
          .on('error', spawnError => console.error(spawnError));
      }
    }
  }
}



module.exports = [
  Object.assign(
    {
      target: 'electron-main',
      entry: { main: './src/main.ts' }
    },
    commonConfig),
  Object.assign(
    {
      target: 'electron-renderer',
      output: {
        publicPath: publicPath,
        filename: 'index.js'
      },
      entry: { index: './src/index.ts' },
      plugins: [
        // new HtmlWebpackPlugin({
        //   template: 'src/index.html'
        // }),
        new CopyWebpackPlugin([{
          from: "resources", to: "resources"
        }, { from: "./src/index.html", to: "index.html" }]),
        new webpack.HotModuleReplacementPlugin({})
      ]

    },
    commonConfig)
]
