module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/**/*.{js,ts}",
    "!src/templates/**",
    "!src/__tests__/**",
    "!src/middleware/**", // ⛔️ exclude these if you’re not testing them yet
    "!src/controllers/**", // ⛔️ same here
    "!src/types/**",
    "!**/index.ts", // often just re-exports
  ],
  coveragePathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/src/templates/", // ← EXCLUDE templates
  ],
  setupFilesAfterEnv: ["<rootDir>/src/tests/setup/setup-env.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: { "src/(.*)": "<rootDir>/src/$1" },
  moduleDirectories: ["node_modules", "src"],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/dist/",
    "<rootDir>/coverage/",
    "<rootDir>/src/__tests__/setup/",
    "<rootDir>/src/templates/",
  ],
};
