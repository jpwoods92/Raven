import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

const cleanGlobals = (obj) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const cleanKey = key.trim();
    acc[cleanKey] = value;
    return acc;
  }, {});
};

export default [
  // Global ignores
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.git/**', 'webpack.config.js'],
  },
  // Base JS configuration
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: cleanGlobals({ ...globals.browser }),
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'off',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },

  // TypeScript configurations
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
    },
    rules: {
      ...typescript.configs.recommended.rules,
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },

  // React specific rules
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      react: react,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/prop-types': 'off', // Not needed with TypeScript
      'react/jsx-uses-react': 'off', // Not needed with React 17+
      'react/react-in-jsx-scope': 'off', // Not needed with React 17+
      'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }],
    },
  },

  // Prettier integration
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      prettier: prettier,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
];
