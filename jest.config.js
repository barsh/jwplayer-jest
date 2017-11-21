module.exports = {
  verbose: true,
  collectCoverage: false,
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js"
  ],
  transform: {
    "\\.(ts|tsx)$": "<rootDir>/node_modules/ts-jest/preprocessor.js"
  },
  testRegex: "/[^_].*\\test.(ts|tsx)$"
}
