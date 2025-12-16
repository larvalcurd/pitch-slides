import { defineConfig } from 'eslint/config';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import prettierConfig from 'eslint-config-prettier/flat';
import path from 'path';
import { fileURLToPath } from 'url';
import prettierPlugin from 'eslint-plugin-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    files: ['**/*.{js,jsx,ts,tsx}'],

    ignores: ['node_modules/**', 'dist/**'],

    languageOptions: {
        parser: tsParser,
        parserOptions: {
            project: path.join(__dirname, 'tsconfig.app.json'),
            tsconfigRootDir: __dirname,
            ecmaVersion: 'latest',
            sourceType: 'module',
            ecmaFeatures: { jsx: true },
        },
    },

    plugins: {
        '@typescript-eslint': tsPlugin,
        react: reactPlugin,
        'react-hooks': reactHooksPlugin,
        prettier: prettierPlugin,
    },


    settings: {
        react: {
            version: 'detect',
        },
    },

    rules: {
        ...tsPlugin.configs.recommended.rules,
        ...reactPlugin.configs.recommended.rules,
        ...reactHooksPlugin.configs.recommended.rules,
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'react/react-in-jsx-scope': 'off',
        'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    },

    ...prettierConfig,
});
