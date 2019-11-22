const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'note-writer.js'
    },
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './',
    },
};