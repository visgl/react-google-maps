module.exports = {
  roots: ['<rootDir>'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/__utils__/'],
  transform: {
    '^.+.tsx?$': ['ts-jest', {tsconfig: 'tsconfig.test.json'}]
  }
};
