module.exports = {
    root: true,
    env: {
        node: true
    },
    'extends': [
        'plugin:vue/essential',
        'eslint:recommended',
        '@vue/typescript/recommended'
    ],
    parserOptions: {
        ecmaVersion: 2020
    },
    rules: {
        'prefer-rest-params': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-this-alias': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        "@typescript-eslint/no-unused-vars": 'off',
        '@typescript-eslint/no-var-requires': 0,
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
    }
}