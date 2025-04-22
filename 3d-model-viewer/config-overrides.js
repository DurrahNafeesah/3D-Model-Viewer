const webpack = require('webpack');

module.exports = function override(config,env) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    path: require.resolve('path-browserify'),
    stream: require.resolve('stream-browserify'),
    os: require.resolve('os-browserify/browser'),
    crypto: require.resolve('crypto-browserify'),
    zlib: require.resolve('browserify-zlib'),
    util: require.resolve('util/'),
    url: require.resolve('url/'),
    process: require.resolve('process/browser'),
  };
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ]);
  config.ignoreWarnings = [/Failed to parse source map/];
  return config;
}; 