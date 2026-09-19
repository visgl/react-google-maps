const path = require('path');

module.exports = {
  roots: ['<rootDir>/tests/bundle'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@vis.gl/react-google-maps/3d$': '<rootDir>/dist/3d/index.modern.mjs',
    '^@vis.gl/react-google-maps/server$': '<rootDir>/dist/server/index.modern.mjs',
    '^@vis.gl/react-google-maps$': '<rootDir>/dist/index.modern.mjs'
  },
  transform: {
    '^.+.tsx?$': [
      'ts-jest',
      {tsconfig: path.join(__dirname, 'tsconfig.test.json')}
    ]
  }
};
