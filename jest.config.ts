import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/', //
    '<rootDir>/build/',
  ],
  moduleNameMapper: {
    '^src/(.*)$': ['<rootDir>/src/$1'],
  },
}
export default config
