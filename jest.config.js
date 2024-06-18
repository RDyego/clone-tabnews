require("dotenv").config({
  path: ".env.development",
});

const nextJest = require("next/jest");

const createJEstConfig = nextJest({
  dir: ".",
});
const jestConfig = createJEstConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
  testTimeout: 60000,
});

module.exports = jestConfig;
