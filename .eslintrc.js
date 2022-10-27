module.exports = {
  env: {
    es2021: true,
    node: true,
    'jest/globals': true,
  },
  extends: [
    'airbnb-base',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:jest/recommended',
    'plugin:security/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/object-curly-spacing': 'off',
    '@typescript-eslint/quotes': ['error', 'single'],
    '@typescript-eslint/no-unused-vars': ['error'],
    'no-underscore-dangle': 'warn',
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
  },
  ignorePatterns: ['.eslintrc.js', 'babel.config.js'],
};