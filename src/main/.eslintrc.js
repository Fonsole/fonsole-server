// http://eslint.org/docs/user-guide/configuring

module.exports = {
  parserOptions: {
    parser: 'babel-eslint',
  },
  // check if imports actually resolve
  settings: {
    'import/resolver': {
      webpack: {
        config: 'compile/webpack.main.config.js',
      },
    },
  },
};
