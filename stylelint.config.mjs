/** @type {import("stylelint").Config} */
export default {
    extends: [
        "stylelint-config-standard",
        "stylelint-prettier/recommended"
    ],
    plugins: ["stylelint-prettier"],
    overrides: [
        {
            files: ['**/*.{js,jsx,ts,tsx}'],
            customSyntax: 'postcss-styled-syntax'
        },
        {
            files: ['**/*.{css,scss,html}'],
        }
    ],
    ignoreFiles: ["node_modules/**", "dist/**"]
};