const path = require('path');

module.exports = {
  roots: ['<rootDir>'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/__utils__/'],
  transform: {
    '^.+.tsx?$': [
      'ts-jest',
      {tsconfig: path.join(__dirname, 'tsconfig.test.json')}
    ]
  }
};
