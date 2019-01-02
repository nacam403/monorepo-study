module.exports = {
  presets: ['@babel/env', '@babel/typescript'],
  env: {
    test: {
      plugins: ['istanbul'],
    },
  },
}
