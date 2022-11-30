module.exports = {
  extends: [
    "../.eslintrc.js",
    "plugin:vue/essential",
    "@vue/typescript/recommended"
  ],
  "globals": {
    "process": true
  },
  rules: {
    "vue/multi-word-component-names": "off"
  }
};
