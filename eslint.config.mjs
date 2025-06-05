import { FlatCompat } from '@eslint/eslintrc';
import pluginQuery from '@tanstack/eslint-plugin-query';

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ['next', 'next/typescript', 'prettier'],
    rules: {
      // Ignore react-hooks/exhaustive-deps
      // Ensure manual dependency updates are intentional
      'react-hooks/exhaustive-deps': 'off',
      // Ignore stylesheet rules
      // TODO: Remove once we have a better way to handle experiences' stylesheets
      '@next/next/no-css-tags': 'off',
      // Ignore next/image rules
      // Justify each use with a comment
      '@next/next/no-img-element': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  }),
  ...pluginQuery.configs['flat/recommended'],
];

export default eslintConfig;
