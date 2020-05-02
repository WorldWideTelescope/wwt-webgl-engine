module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 8
  },
  extends: [
    "eslint:recommended"
  ],
  env: {
    node: true
  },
  rules: {
    "no-unused-vars": [
      "warn", {
        "args": "all",
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }
    ]
  }
};