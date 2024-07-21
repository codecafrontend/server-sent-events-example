/** @type {import('stylelint').Config} */
module.exports = {
    extends: ['stylelint-config-standard', 'stylelint-config-clean-order'],
    rules: {
        'block-no-empty': true,
        'selector-class-pattern': null,
    },
};
