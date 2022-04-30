const path = require('path');
const pkg = require('./package.json');

module.exports = {
  devServer:
    {
      port: 8000,
    },
  publicPath: '/',
  lintOnSave: false,
  css:
    {
      sourceMap: process.env.NODE_ENV === 'development',
      loaderOptions:
        {
          scss:
            {
              prependData: `@import "src/sass/variables"; @import "src/sass/sakai/mixins";`
            }
        }
    },
  configureWebpack: {
    devtool: process.env.NODE_ENV === 'development' ? 'inline-source-map' : false,
  },
  chainWebpack: config =>
  {
    config.resolve.alias.set('src', path.resolve(__dirname, 'src'));
    config.resolve.alias.set('@', path.resolve(__dirname, 'src'));
    config.resolve.alias.set('~', path.resolve(__dirname, 'node_modules'));
    config.plugin('define')
      .tap(args =>
      {
        args[0]['process.env'].VITE_APP_BUILD_EPOCH = new Date().getTime();
        args[0]['process.env'].VITE_APP_VERSION = JSON.stringify(pkg.version);
        return args;
      });
  },
}
