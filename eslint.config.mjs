import { fixupPluginRules } from '@eslint/compat';
import autofix from 'eslint-plugin-autofix';
import reactHooks from 'eslint-plugin-react-hooks';
import sortKeysFix from 'eslint-plugin-sort-keys-fix';
import reactCompiler from 'eslint-plugin-react-compiler';
import react from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import js from '@eslint/js';

const eslintConfig = [
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/.wrangler/**', 'src/db.ts', 'src/app/Document.tsx'],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        ...globals.node,
        React: 'readonly',
      },
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      autofix,
      import: importPlugin,
      'jsx-a11y': jsxA11y,
      react,
      'react-compiler': reactCompiler,
      'react-hooks': fixupPluginRules(reactHooks),
      'sort-keys-fix': sortKeysFix,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...typescriptEslint.configs.recommended.rules,
      'react-compiler/react-compiler': 'error',
      'sort-keys-fix/sort-keys-fix': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
        },
      ],
      'arrow-body-style': ['warn', 'always'],
      'autofix/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'import/order': [
        'warn',
        {
          alphabetize: {
            order: 'asc',
          },
          groups: ['builtin', 'external', 'parent', 'sibling', 'index', 'object', 'type'],
          pathGroups: [
            {
              group: 'parent',
              pattern: '@/**/**',
              position: 'before',
            },
          ],
        },
      ],
      'no-console': 'warn',
      'no-redeclare': 'warn',
      quotes: ['warn', 'single'],
      'react/display-name': 'error',
      'react/jsx-key': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/self-closing-comp': [
        'error',
        {
          component: true,
          html: true,
        },
      ],
      'spaced-comment': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];

export default eslintConfig;
