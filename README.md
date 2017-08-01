# y-server-static

y-server-static is a [y-server](https://github.com/yued-fe/y-server) plugin to read/proxy static resource.

## Install

```bash
npm install y-server-static
```

## Usage

```javascript
var path = require('path');

var yServer = require('y-server');
var staticPlugin = require('y-server-static');

yServer.run({
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
