import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  // Base JS recommended rules
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: {
      js,
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': 'warn',
      'no-underscore-dangle': 'off',
      'consistent-return': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'prefer-const': 'error',
      eqeqeq: 'error',
      'no-multi-spaces': 'error',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-else-return': ['error', { allowElseIf: false }],
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',
      'no-loop-func': 'warn',
      curly: ['error', 'all'],
      'no-nested-ternary': 'warn',
      'object-shorthand': ['error', 'always'],
      'no-param-reassign': 'warn',
      'no-shadow': 'warn',
      'no-duplicate-imports': 'error',
    },
  },

  // CommonJS configuration
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
    },
  },

  // Global variables
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  prettier,
]);
