import prettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginJs from '@eslint/js';

export default [
  {
    ignores: ['coverage/**', '**/dist/**', '**/cache/**', '**/*.d.ts', 'node_modules/**'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.jest,
        ...globals['shared-node-browser'],
        ...globals.es2015,
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
];
