import expoConfig from "eslint-config-expo/flat.js";
import { defineConfig } from "eslint/config";
import { baseWithoutTypescript as baseConfig } from "@repo/eslint-config/base";

const LEAF_FEATURES = [
  "about",
  "chapters",
  "fragments",
  "home",
  "map",
  "profile",
  "search",
  "timeline",
];

const boundary = (files, blocked, message) => ({
  files,
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: blocked.map((name) => `@/features/${name}/**`),
            message,
          },
          {
            group: ["@/dev/**"],
            message: "Product code cannot import from dev/.",
          },
        ],
      },
    ],
  },
});

const OFF_SCALE_SPACING = String.raw`/\b(?:gap(?:-[xy])?|p[xytblrse]?|m[xytblrse]?|space-[xy]|inset(?:-[xy])?|top|bottom|left|right|start|end)-(?:1\.5|2\.5|3|3\.5|5|6|7|9|10|11|12|14)\b/`;

const REACT_NAMESPACE = [
  "ImportNamespaceSpecifier[local.name='React']",
  "TSQualifiedName[left.name='React']",
  "MemberExpression[object.name='React']",
].map((selector) => ({
  selector,
  message:
    "Import what you need from 'react' instead of using the React namespace.",
}));

const noReactNamespace = {
  files: ["src/**/*.{ts,tsx}"],
  rules: { "no-restricted-syntax": ["error", ...REACT_NAMESPACE] },
};

const spacingScale = {
  files: [
    "src/app/**/*.{ts,tsx}",
    "src/features/**/*.{ts,tsx}",
    "src/providers/**/*.{ts,tsx}",
    "src/components/{layout,map,motion,scrapbook}/**/*.{ts,tsx}",
  ],
  ignores: ["src/app/showcase.tsx"],
  rules: {
    "no-restricted-syntax": [
      "error",
      ...REACT_NAMESPACE,
      ...["Literal", "TemplateElement"].map((node) => ({
        selector:
          node === "Literal"
            ? `Literal[value=${OFF_SCALE_SPACING}]`
            : `TemplateElement[value.raw=${OFF_SCALE_SPACING}]`,
        message:
          "Spacing must follow the Space scale (2, 4, 8, 16, 32, 64px). Use gap/p/m-0.5, 1, 2, 4, 8 or 16.",
      })),
    ],
  },
};

export default defineConfig([
  expoConfig,
  ...baseConfig,
  {
    ignores: ["dist/*"],
  },
  noReactNamespace,
  spacingScale,
  {
    files: ["src/components/ui/**/*.{ts,tsx}"],
    rules: { "react-hooks/refs": "off" },
  },
  {
    files: ["src/dev/**/*.{ts,tsx}", "src/app/showcase.tsx"],
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-require-imports": "off",
      "react-hooks/incompatible-library": "off",
    },
  },
  ...LEAF_FEATURES.map((name) =>
    boundary(
      [`src/features/${name}/**/*.{ts,tsx}`],
      LEAF_FEATURES.filter((other) => other !== name),
      "Features cannot import other features. Move shared code to components/, lib/ or a core feature.",
    ),
  ),
  boundary(
    ["src/features/{archive,session,settings}/**/*.{ts,tsx}"],
    LEAF_FEATURES,
    "Core features cannot import leaf features.",
  ),
  boundary(
    [
      "src/components/**/*.{ts,tsx}",
      "src/lib/**/*.{ts,tsx}",
      "src/theme/**/*.{ts,tsx}",
      "src/providers/**/*.{ts,tsx}",
    ],
    LEAF_FEATURES,
    "Shared code cannot import leaf features.",
  ),
  {
    files: [
      "src/components/{layout,map,motion,scrapbook}/**/*.{ts,tsx}",
      "src/lib/**/*.{ts,tsx}",
      "src/theme/**/*.{ts,tsx}",
    ],
    rules: {
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/**"],
              allowTypeImports: true,
              message:
                "Shared code may only import types from features. Move the component into the feature that owns it.",
            },
          ],
        },
      ],
    },
  },
]);
