module.exports = {
  extends: [
    "react-app",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
  ],
  rules: {
    "react-hooks/exhaustive-deps": "off",
    "unused-imports/no-unused-imports": "error",
    "import/order": [
      "error",
      {
        "newlines-between": "never",
        alphabetize: { order: "asc" },
      },
    ],
  },
  plugins: ["unused-imports", "import"],
};
