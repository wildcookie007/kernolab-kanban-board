const tsconfig = require('./tsconfig.json');
const moduleNameMapper = require('tsconfig-paths-jest')(tsconfig);

module.exports = {
    setupFiles: ['./jest.setup.js'],
    testEnvironment: 'jsdom',
    transform: { '^.+\\.(js|ts|jsx|tsx)$': 'ts-jest' },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(tsx?)$',
    testPathIgnorePatterns: ['/node_modules/', '/__tests__/mock/'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    moduleNameMapper: {
        '\\.(css|scss)$': '<rootDir>/__mocks__/styles.ts',
        ...moduleNameMapper,
    },
    globals: { NODE_ENV: 'test' },
};
