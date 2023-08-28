module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'simple-import-sort',
    'unused-imports',
    'prettier'
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
  ],
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [
    '.eslintrc.js'
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'prettier/prettier': 'warn',
    'simple-import-sort/imports': 'warn',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': ['error', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
  },
};
