import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  prettierConfig,
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      "prettier/prettier": "error",

      "react/jsx-first-prop-new-line": ["error", "multiline-multiprop"],
      "react/jsx-max-props-per-line": ["error", { maximum: 1, when: "multiline" }],
      "react/jsx-closing-bracket-location": ["error", "line-aligned"],

      "import/order": [
        "error",
        {
          groups: [["builtin", "external"], "internal"],
          "newlines-between": "always",
        },
      ],
    },
  },

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
