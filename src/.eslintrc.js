// http://eslint.org/docs/user-guide/configuring

module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    es6: false,
    node: false,
  },
  // required to lint *.vue files
  plugins: [
    'html',
  ],
  // check if imports actually resolve
  settings: {
    'import/resolver': {
      'webpack': {
        'config': 'webpack.config.js',
      },
    },
  },
};
