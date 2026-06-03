import tsparser from "@typescript-eslint/parser";
import { defineConfig } from "eslint/config";
import obsidianmd from "eslint-plugin-obsidianmd";

export default defineConfig([
  {
    ignores: [
      "main.js",
      "node_modules/**",
    ],
  },
  ...obsidianmd.configs.recommended,
  {
    files: ["main.ts", "src/**/*.ts"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "no-console": "off",
      "no-empty": ["error", { allowEmptyCatch: true }],
      "no-restricted-globals": "warn",
      "obsidianmd/sample-names": "off",
      "obsidianmd/ui/sentence-case": [
        "error",
        {
          brands: ["API", "Ko-fi", "Obsidian", "Todoist", "Todoist Board"],
        },
      ],
    },
  },
  {
    files: ["main.ts"],
    rules: {
      "@typescript-eslint/await-thenable": "warn",
      "@typescript-eslint/no-deprecated": "warn",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-require-imports": "warn",
      "no-alert": "warn",
      "no-undef": "warn",
      "obsidianmd/commands/no-plugin-id-in-command-id": "warn",
      "obsidianmd/no-forbidden-elements": "warn",
      "obsidianmd/no-static-styles-assignment": "warn",
      "obsidianmd/rule-custom-message": "warn",
      "obsidianmd/ui/sentence-case": [
        "warn",
        {
          brands: ["API", "Ko-fi", "Obsidian", "Todoist", "Todoist Board"],
        },
      ],
    },
  },
]);
