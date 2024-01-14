module.exports = {
    // The root of your source code, typically /src
    // `<rootDir>` is a token Jest substitutes
    roots: ["<rootDir>/src"],

    // Jest transformations -- this adds support for TypeScript
    // using ts-jest
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },

    // Runs special logic, such as cleaning up components
    // when using React Testing Library and adds special
    // extended assertions to Jest
    setupFilesAfterEnv: ["@testing-library/jest-dom"],

    automock: false,
    setupFiles: ["./setupJest.js"],

    // Test spec file resolution pattern
    // Matches parent folder `__tests__` and filename
    // should contain `test` or `spec`.
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",

    // Module file extensions for importing
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    collectCoverageFrom: ["src/**/*.{ts,tsx}"],

    moduleNameMapper: {
        "\\.(ttf|woff|woff2|css)$": "<rootDir>/jest/fileMock.js"
    },

    testEnvironment: "jsdom"
};
