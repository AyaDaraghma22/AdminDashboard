const path = require('path');

module.exports = {
  mode: 'development',
  entry: './frontend/Basic.html',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['html-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'] // Add loaders for CSS files
      }
    ]
  }
};
