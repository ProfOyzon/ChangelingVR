/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  printWidth: 100,
  singleQuote: true,
  plugins: ['prettier-plugin-tailwindcss', '@trivago/prettier-plugin-sort-imports'],
  importOrder: [
    '^react(.*)$',
    '^next(.*)$',
    '^@vercel(.*)$',
    '<THIRD_PARTY_MODULES>',
    '^features/(.*)$',
    '^components/(.*)$',
    '^hooks/(.*)$',
    '^lib/(.*)$',
    '^app/(.*)$',
    '^[./]',
  ],
  importOrderSortSpecifiers: true,
};

export default config;
