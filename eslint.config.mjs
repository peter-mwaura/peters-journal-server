// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'eslint.config.mjs',
      'commitlint.config.js',
      'prettier.config.js',
      '.husky/**',
      'dist/**',
      'node_modules/**',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'module', // match your TS module system
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: 2020, // match your previous .eslintrc.js
      },
    },
  },
  {
    rules: {
      // Prettier integration
      'prettier/prettier': 'error',

      // TypeScript/NestJS rules
      '@typescript-eslint/explicit-function-return-type': 'off', // let NestJS handle return types
      '@typescript-eslint/no-explicit-any': 'warn', // discourage but don’t block `any`
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ], // allow unused args starting with _
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',

      // General JS rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
);
