import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
      },
    }],
  },
  testEnvironment: 'node',
};

export default config;
