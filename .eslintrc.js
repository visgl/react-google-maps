// @ts-check
module.exports = {
  plugins: ['react', 'import', 'react-hooks', '@typescript-eslint'],
  extends: ['prettier', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',

  env: {
    node: true,
    browser: true,
    es6: true
  },

  globals: {
    google: true
  },

  settings: {
    react: {
      version: 'detect'
    }
  },

  ignorePatterns: ['node_modules', '**/dist*/**/*.js'],

  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },

  rules: {
    'no-continue': 'off',
    'no-console': ['error', {allow: ['warn', 'error']}]
  },
  overrides: [
    {
      files: ['examples/**/*'],
      rules: {
        'no-process-env': 'off'
      }
    },
    {
      files: ['./{src,examples}/**/*.{ts,mts,cts,tsx}'],
      rules: {
        // Some of JS rules don't always work correctly in TS and
        // hence need to be reimported as TS rules
        'no-redeclare': 'off',
        'no-shadow': 'off',
        'no-use-before-define': 'off',
        'no-dupe-class-members': 'off',

        // typescript does a good job tracking return types
        'consistent-return': 'off',

        'no-undef': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': [
          'error',
          {additionalHooks: '(useDeepCompareEffect)'}
        ],
        'react/jsx-no-constructed-context-values': 'error',

        // We use function hoisting to put exports at top of file
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-dupe-class-members': ['error'],

        // We encourage explicit typing, e.g `field: string = ''`
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {ignoreRestSiblings: true, destructuredArrayIgnorePattern: '^_'}
        ]
      },
      parserOptions: {project: ['**/tsconfig.json']}
    },
    {
      files: ['**/__tests__/**/*.{ts,tsx}'],
      rules: {
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off'
      }
    }
  ]
};
