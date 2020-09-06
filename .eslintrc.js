module.exports = {
    parser: "babel-eslint",
    env: {
        browser: true,
        es6: true,
        node: true
    },
    plugins: ["prettier", "react", "react-hooks"],
    rules: {
        "prettier/prettier": "error",
        "prefer-const": "error",
        "no-use-before-define": "error",
        "no-var": "error",
        "no-throw-literal": "error",
        "no-console": "off",
    },
    extends: ["prettier", "plugin:react/recommended", "eslint:recommended"]
};
