const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const rootProjectBabelConfig = require('../../babel.config')

const env = process.env.NODE_ENV || 'development'

module.exports = {
  mode: env === 'development' ? 'development' : 'production',

  entry: './src/index.tsx',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contentHash].js',
  },

  module: {
    rules: [
      {
        test: /\.js|.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              ...rootProjectBabelConfig,
              cacheDirectory: true,
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
  ],

  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },

  devServer: {
    port: 3000,
  },
}
