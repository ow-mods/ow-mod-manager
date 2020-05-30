module.exports = [
  {
    test: /\.tsx?$/,
    exclude: /(node_modules|\.webpack)/,
    use: {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
        babelrc: true,
      },
    },
  },
];
