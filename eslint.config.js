import { FlatCompat } from '@eslint/eslintrc'
import eslintJs from '@eslint/js'

const compat = new FlatCompat()

const conf = [
  {
    ignores: ['dist'],
  },
  ...compat.extends('plugin:vue/vue3-recommended'),
  eslintJs.configs.recommended,
  ...compat.extends('@vue/eslint-config-typescript', '@vue/eslint-config-prettier'),
  {
    rules: {
      camelcase: [1, { ignoreImports: true }],
      'no-inner-declarations': 0,
      'vue/attribute-hyphenation': [2, 'never'],
      'vue/v-on-event-hyphenation': [2, 'never'],
      '@typescript-eslint/no-unused-vars': [
        1,
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
]

export default conf
