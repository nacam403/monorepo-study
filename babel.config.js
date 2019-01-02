module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        exclude: ['transform-regenerator'],
      },
    ],
    '@babel/typescript',
  ],
  env: {
    test: {
      plugins: ['istanbul'],
    },
  },
}
