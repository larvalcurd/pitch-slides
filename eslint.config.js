// Импорт необходимых модулей для конфигурации ESLint
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import path from 'path';
import { fileURLToPath } from 'url';

// Получение пути к текущему файлу и директории
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Экспорт массива конфигураций ESLint
export default [
    // Конфигурация для JavaScript и JSX файлов
    {
        // Файлы, к которым применяется эта конфигурация
        files: ['**/*.{js,jsx}'],

        // Игнорируемые файлы и директории, включая сам конфиг ESLint
        ignores: ['node_modules/**', 'dist/**', 'eslint.config.js'],

        // Настройки языка
        languageOptions: {
            ecmaVersion: 'latest', // Версия ECMAScript
            sourceType: 'module', // Тип модуля
            ecmaFeatures: { jsx: true }, // Поддержка JSX
        },

        // Подключаемые плагины
        plugins: {
            react: reactPlugin, // Плагин для React
            'react-hooks': reactHooksPlugin, // Плагин для React Hooks
        },

        // Настройки для плагинов
        settings: {
            react: {
                version: 'detect', // Автоматическое определение версии React
            },
        },

        // Правила линтинга
        rules: {
            ...reactPlugin.configs.recommended.rules, // Рекомендованные правила для React
            ...reactHooksPlugin.configs.recommended.rules, // Рекомендованные правила для React Hooks
            'react-hooks/rules-of-hooks': 'error', // Ошибка за нарушение правил хуков
            'react-hooks/exhaustive-deps': 'warn', // Предупреждение за неполные зависимости
            'react/react-in-jsx-scope': 'off', // Отключение правила о React в JSX
        },
    },
    // Конфигурация для TypeScript и TSX файлов
    {
        // Файлы, к которым применяется эта конфигурация
        files: ['**/*.{ts,tsx}'],

        // Игнорируемые файлы и директории
        ignores: ['node_modules/**', 'dist/**', 'vite.config.ts'],

        // Настройки языка и парсера
        languageOptions: {
            parser: tsParser, // Парсер для TypeScript
            parserOptions: {
                project: path.join(__dirname, 'tsconfig.app.json'), // Путь к TSConfig
                tsconfigRootDir: __dirname, // Корневая директория для TSConfig
                ecmaVersion: 'latest', // Версия ECMAScript
                sourceType: 'module', // Тип модуля
                ecmaFeatures: { jsx: true }, // Поддержка JSX
            },
        },

        // Подключаемые плагины
        plugins: {
            '@typescript-eslint': tsPlugin, // Плагин для TypeScript
            react: reactPlugin, // Плагин для React
            'react-hooks': reactHooksPlugin, // Плагин для React Hooks
        },

        // Настройки для плагинов
        settings: {
            react: {
                version: 'detect', // Автоматическое определение версии React
            },
        },

        // Правила линтинга
        rules: {
            ...tsPlugin.configs.recommended.rules, // Рекомендованные правила для TypeScript
            ...reactPlugin.configs.recommended.rules, // Рекомендованные правила для React
            ...reactHooksPlugin.configs.recommended.rules, // Рекомендованные правила для React Hooks
            'react-hooks/rules-of-hooks': 'error', // Ошибка за нарушение правил хуков
            'react-hooks/exhaustive-deps': 'warn', // Предупреждение за неполные зависимости
            'react/react-in-jsx-scope': 'off', // Отключение правила о React в JSX
        },
    },
];