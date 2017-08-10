module.exports = {
  settings: {
    'import/resolver': {
      webpack: {
        config: 'compile/webpack.web.config.js',
      },
    },
  },
  env: {
    mocha: true,
  },
  globals: {
    assert: true,
    expect: true,
    should: true,
    sinon: true,
    __static: true,
  },
  rules: {
    'func-names': 0,
    'prefer-arrow-callback': 0,
    'no-unused-expressions': 0,
  },
};
