/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  "root": true,
  "extends": [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript/recommended",
  ],
  "env": {
    "vue/setup-compiler-macros": true,
  },
  rules: {
    "vue/multi-word-component-names": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "vue/script-indent": ["error", 2, { "baseIndent": 0 }],
  },
};
