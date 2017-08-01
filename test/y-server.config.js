'use strict';

const path = require('path');

const abs = file => path.join(__dirname, file);

const staticPlugin = require('../index.js');

module.exports = {
  watch: abs('../index.js'),
  plugins: [
    staticPlugin({
      staticPaths: {
        '/test': abs('../test'),
        '/lbf': 'https://qidian.gtimg.com/lbf/1.0.4',
      },
    }),
  ],
};
