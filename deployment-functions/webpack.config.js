const path = require('path')
const slsw = require('serverless-webpack')
const nodeExternals = require('webpack-node-externals')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const Dotenv = require('dotenv-webpack')

const plugins = [
  new CopyWebpackPlugin([
    {
      from: path.join(__dirname, '../.next/**'),
      to: '.next'
    }
  ]),
  new Dotenv({
    path: path.join(__dirname, '../.env'),
    systemvars: true
  })
]

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  mode: 'production',
  // Necessary for __dirname and __filename to work correctly
  // when bundling with Webpack for the dev environment.
  // XXX See https://github.com/webpack/webpack/issues/1599
  node: {
    __dirname: true,
    __filename: true
  },
  plugins,
  // Generate sourcemaps for proper error messages
  devtool: 'source-map',
  // We use webpack-node-externals to excludes all node deps. (like aws-sdk)
  // You can manually set the externals too.
  externals: [nodeExternals()],
  // Run babel on all .js files and skip those in node_modules
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: {
                    node: '8.10'
                  }
                }]
              ]
            }
          }
        ]
      }
    ]
  },
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
    sourceMapFilename: '[file].map'
  }
}
