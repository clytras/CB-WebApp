const path = require('path');
const { DefinePlugin } = require("webpack");
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
      '@assets': path.resolve(__dirname, 'src/assets'),
    },
    resolve: {
      extensions: ['.css', '.jsx']
    },
    plugins: [
      new DefinePlugin({
        "process.env.APP_VERSION": JSON.stringify(
          require("./package.json").version
        )
      })
    ]
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
        '@assets': '<rootDir>/src/assets',
      }
    }
  },
  plugins: [{
    plugin: reactHotReloadPlugin
  }]
}
