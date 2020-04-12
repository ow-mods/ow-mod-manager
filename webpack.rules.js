module.exports = [
  {
    test: /\.tsx?$/,
    exclude: /(node_modules|\.webpack)/,
    use: {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
        babelrc: false,
        presets: [
          ['@babel/preset-env', { targets: { browsers: 'last 1 version' } }],
          '@babel/preset-typescript',
          '@babel/preset-react',
        ],
        plugins: [
          // plugin-proposal-decorators is only needed if you're using experimental decorators in TypeScript
          ['@babel/plugin-proposal-decorators', { legacy: true }],
          ['@babel/plugin-proposal-class-properties', { loose: true }],
          'react-hot-loader/babel',
        ],
      },
    },
  },
];
