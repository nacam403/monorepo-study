module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'standard',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    'no-console': 'off',
    // 一部のESLintルールは、TypeScriptで書かれたコードに対して上手く動かないので、offにする必要がある。
    // https://qiita.com/terrierscript/items/885879d8ed8df40b9098
    'no-unused-vars': 'off',
    'no-undef': 'off',
  },
}
