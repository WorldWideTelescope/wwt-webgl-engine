module.exports = {
  extends: [
    "../.eslintrc.js",
    "plugin:vue/essential",
    "@vue/typescript/recommended"
  ],
  overrides: [
    {
      files: ['src/Skyball.vue'],
      rules: {
        'vue/multi-word-component-names': 'off',
      },
    },
  ],
};
