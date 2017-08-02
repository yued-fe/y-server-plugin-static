# y-server-plugin-static

y-server-plugin-static is a [y-server](https://github.com/yued-fe/y-server) plugin to read/proxy static resource.

## Install

```bash
npm install y-server-plugin-static
```

## Usage

```javascript
const path = require('path');

const yServer = require('y-server');
const staticPlugin = require('y-server-plugin-static');

yServer({
  plugins: [
    staticPlugin({
      staticPaths: {
        '/test': path.join(__dirname, 'test'),
        '/lbf': 'https://qidian.gtimg.com/lbf/1.0.4',
      },
    }),
  ],
});
```

## Notes

* `staticPaths` is the Object which will be read/proxy.

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
