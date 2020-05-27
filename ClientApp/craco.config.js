const path = require('path');
const reactHotReloadPlugin = require('craco-plugin-react-hot-reload');

module.exports = {
  webpack: {
    alias: {
      '@lazy': path.resolve(__dirname, 'src/components/lazy'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@i18n': path.resolve(__dirname, 'src/i18n'),
      '@stores': path.resolve(__dirname, 'src/stores'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@api-auth': path.resolve(__dirname, 'src/components/api-authorization'),
      '@data': path.resolve(__dirname, 'src/data'),
    },
    resolve: {
      extensions: ['.css', '.jsx']
    }
  },
  jest: {
    configure: {
      moduleNameMapper: {
        // '^@(.*)$': '<rootDir>/src$1'
        '@lazy': '<rootDir>/src/components/lazy',
        '@components': '<rootDir>/src/components',
        '@i18n': '<rootDir>/src/i18n',
        '@stores': '<rootDir>/src/stores',
        '@utils': '<rootDir>/src/utils',
        '@api-auth': '<rootDir>/src/components/api-authorization',
        '@data': '<rootDir>/src/data',
      }
    }
  },
  plugins: [{
    plugin: reactHotReloadPlugin
  }]
}
