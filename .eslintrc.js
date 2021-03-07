module.exports = {
  extends: [
    "react-app",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
  ],
  rules: {
    "no-loop-func": "off", // TODO: reenable and fix
    "react/jsx-pascal-case": "off",
    "react-hooks/exhaustive-deps": "off",
    "unused-imports/no-unused-imports": "error",
    "import/no-named-as-default": "off",
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
