import babelParser from "@babel/eslint-parser";
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import turboPlugin from "eslint-plugin-turbo";
import onlyWarn from "eslint-plugin-only-warn";

const files = [
  "**/*.js",
  "**/*.mjs",
  "**/*.cjs",
  "**/*.jsx",
  "**/*.ts",
  "**/*.tsx",
  "**/*.mts",
  "**/*.cts",
];
const decoratorsPlugin = [
  "@babel/plugin-syntax-decorators",
  { version: "legacy" },
];

/** @type {import("eslint").Linter.Config[]} */
export const config = [
  { ...js.configs.recommended, files },
  { ...eslintConfigPrettier, files },
  {
    files,
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ["@babel/preset-typescript"],
          plugins: [decoratorsPlugin, "@babel/plugin-syntax-jsx"],
        },
      },
    },
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
    },
  },
  {
    files,
    plugins: {
      onlyWarn,
    },
  },
  {
    ignores: ["dist/**"],
  },
];
