const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@i18n': path.resolve(__dirname, 'src/i18n'),
      '@stores': path.resolve(__dirname, 'src/stores')
    }
  },
  jest: {
    configure: {
      moduleNameMapper: {
        // '^@(.*)$': '<rootDir>/src$1'
        '@components': '<rootDir>/src/components',
        '@i18n': '<rootDir>/src/i18n',
        '@stores': '<rootDir>/src/stores'
      }
    }
  }
}
