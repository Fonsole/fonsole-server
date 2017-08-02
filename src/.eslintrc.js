// http://eslint.org/docs/user-guide/configuring

module.exports = {
  env: {
    browser: true,
    es6: false,
    node: false,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  // check if imports actually resolve
  settings: {
    'import/resolver': {
      'webpack': {
        'config': 'webpack.config.js',
      },
    },
  },
};
