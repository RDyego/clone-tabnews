require("dotenv").config({
  path: ".env.development",
});

const nextJest = require("next/jest");

const createJEstConfig = nextJest({
  dir: ".",
});
const jestConfig = createJEstConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
});

module.exports = jestConfig;
