const path = require('path');

const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  webpack: {
    configure: {
      target: 'electron-renderer',
    },
    alias: {
      '@store': path.resolve('src/store'),
      '@action': path.resolve('src/action'),
      '@view': path.resolve('src/view'),
      '@request': path.resolve('src/request'),
      '@reducer': path.resolve('src/reducer'),
    },
  }
}
 
