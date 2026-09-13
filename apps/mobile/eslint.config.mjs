import expoConfig from "eslint-config-expo/flat.js";
import { defineConfig } from "eslint/config";
import { baseWithoutTypescript as baseConfig } from "@repo/eslint-config/base";

export default defineConfig([
  expoConfig,
  ...baseConfig,
  {
    settings: {
      "import/resolver": {
        node: { extensions: [".js", ".jsx", ".ts", ".tsx"] },
        typescript: false,
      },
    },
  },
  {
    ignores: ["dist/*"],
  },
]);
