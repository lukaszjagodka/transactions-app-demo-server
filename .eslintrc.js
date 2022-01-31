module.exports = {
    "root": true,
    "env": {
        "es2021": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "project": './tsconfig.json',
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        semi: ['error', 'always'],
        quotes: ['error', 'single'],
    }
}
