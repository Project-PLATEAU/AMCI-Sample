module.exports = {
  plugins: ['stylelint-scss'],
  extends: ['stylelint-config-standard', 'stylelint-config-prettier', 'stylelint-config-recess-order'],
  // add your custom config here
  // https://stylelint.io/user-guide/configuration
  rules: {
    'at-rule-no-unknown': null,
    'block-no-empty': null,
    'color-hex-case': 'lower',
    'comment-empty-line-before': null,
    'no-descending-specificity': null,
    'no-empty-source': null,
    'scss/at-rule-no-unknown': true,
  },
  ignoreFiles: ['node_modules', '**/*.svg'],
}
