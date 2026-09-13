import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import turboPlugin from "eslint-plugin-turbo";
import onlyWarn from "eslint-plugin-only-warn";
import tseslint from "typescript-eslint";

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

/** @type {import("eslint").Linter.Config[]} */
export const baseWithoutTypescript = [
  { ...js.configs.recommended, files },
  { ...eslintConfigPrettier, files },
  {
    files,
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

/** @type {import("eslint").Linter.Config[]} */
export const config = [
  { ...js.configs.recommended, files },
  ...tseslint.configs.recommended.map((c) => ({ ...c, files })),
  { ...eslintConfigPrettier, files },
  {
    files,
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
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
