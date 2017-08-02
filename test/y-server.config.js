'use strict';

const path = require('path');

const staticPlugin = require('../index.js');

module.exports = {
  watch: path.join(__dirname, '../index.js'),
  plugins: [
    staticPlugin({
      staticPaths: {
        '/test': path.join(__dirname, '../test'),
        '/lbf': 'https://qidian.gtimg.com/lbf/1.0.4',
      },
    }),
  ],
};
