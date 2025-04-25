// @ts-check
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pluginNext from '@next/eslint-plugin-next';
import js from '@eslint/js';
import next from 'next';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a compat instance to allow us to extend Next.js configs.
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

// Frontend part: extend Next recommended configs.
const frontendConfig = [
  {
    files: ['apps/frontend/**/*.{js,ts,jsx,tsx}'],
    ...compat.extends(
      'plugin:@next/next/recommended',
      'next/core-web-vitals',
    )[0],
    settings: {
      next: {
        rootDir: 'apps/frontend',
      },
    },
  },
];

// Backend part: configure TypeScript, Node, and Jest globals along with recommended rules.
const backendConfig = tseslint.config(
  {
    ignores: ['eslint.config.mjs'], // adjust if needed
  },
  // Recommended ESLint settings
  // (You may also merge eslint.configs.recommended if you have a separate reference)
  eslintPluginPrettierRecommended,
  // Recommended settings for TypeScript with type checking.
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        // Ensure the TS parser can resolve the proper tsconfig(s)
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
    },
  },
);

// Export a single configuration array that merges both:
export default [
  ...frontendConfig,
  // Note: You can merge the backend config globally or limit it to specific globs.
  // For example, if backend files reside in apps/backend, you can add an "overrides" field.
  ...backendConfig,
];
