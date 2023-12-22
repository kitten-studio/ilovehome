module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: ['../../.eslintrc.base.js'],
  globals: {JSX: 'readonly'},
};
