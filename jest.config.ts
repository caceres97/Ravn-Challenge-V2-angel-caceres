import type { Config } from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
    verbose: true,
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ['<rootDir>/__tests__/**/*.test.ts'],
    // roots: [
    //     "<rootDir>/src"
    // ],
    // testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$",
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
};
export default config;