const { resolve } = require('path')
const root = resolve(__dirname)

module.exports = {
    displayName: 'root-tests',
    rootDir: root,
    testMatch: ['<rootDir>/src/**/*.test.js'],
    testEnvironment: 'node',
    clearMocks: true,
}
