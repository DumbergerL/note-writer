const path = require('path');

module.exports = {
    entry: {
      "note-writer": './src/index.js',
      "piano-role": './src/UI/PianoRole/index.js',
      'ui': './src/UI/UI.js',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js'
    },
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './',
    },
};