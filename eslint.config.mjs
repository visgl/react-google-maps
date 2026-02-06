// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  // Base configuration
  eslint.configs.recommended,

  // Global ignores
  {
    ignores: ['**/node_modules/**', '**/dist*/**/*.js']
  },

  // Base config for all files
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        google: 'readonly'
      }
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,

      'no-continue': 'off',
      'no-console': ['error', {allow: ['warn', 'error']}],
      'no-prototype-builtins': 'off',

      // React 19 uses automatic JSX runtime
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',

      // TypeScript handles prop validation
      'react/prop-types': 'off'
    }
  },

  // TypeScript files
  ...tseslint.configs.recommended.map(config => ({
    ...config,
    files: ['**/*.{ts,mts,cts,tsx}']
  })),
  {
    files: ['**/*.{ts,mts,cts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['**/tsconfig.json']
      }
    },
    rules: {
      // React Hooks - add custom hook to exhaustive deps check
      'react-hooks/exhaustive-deps': [
        'error',
        {additionalHooks: '(useDeepCompareEffect)'}
      ],

      // We use function hoisting to put exports at top of file
      '@typescript-eslint/no-use-before-define': 'off',

      // We encourage explicit typing, e.g `field: string = ''`
      '@typescript-eslint/no-inferrable-types': 'off',

      // Allow unused vars with _ prefix or in destructuring
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {ignoreRestSiblings: true, destructuredArrayIgnorePattern: '^_'}
      ]
    }
  },

  // Examples directory
  {
    files: ['examples/**/*'],
    rules: {
      'no-process-env': 'off'
    }
  },

  // Test files
  {
    files: ['**/__tests__/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'react/display-name': 'off'
    }
  },

  // Prettier config (must be last to override formatting rules)
  prettierConfig
);
