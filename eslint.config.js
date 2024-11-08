import antfu from '@antfu/eslint-config';

export default antfu(
  {
    unocss: true,
  },
  {
    ignores: ['uni_modules'],
  },
  {
    files: ['**/*.vue'],
    rules: {
      'vue/block-order': [
        'error',
        {
          order: ['template', 'script', 'style'],
        },
      ],
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
    },
  },
  {
    rules: {
      // 需要尾随逗号
      'comma-dangle': ['error', 'only-multiline'],
      // 允许console
      'no-console': 'off',
      // 需要分号
      'style/semi': ['error', 'always'],
      // 块内的空行
      'padded-blocks': ['error', 'never'],
      // 顶级函数应使用 function 关键字声明
      'antfu/top-level-function': 'off',
      // 全局的 process 不能用
      'node/prefer-global/process': 'off',
      'vue/attribute-hyphenation': 'off',
      // 禁止未使用的捕获组
      'regexp/no-unused-capturing-group': 'off',
      // 对所有控制语句强制实施一致的大括号样式
      // curly: ["error", "multi", "consistent"],
      'curly': 'off',
      // 允许接口和类型别名中的成员之间使用三个分隔符
      'style/member-delimiter-style': ['error', {
        multiline: {
          delimiter: 'semi',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
        multilineDetection: 'brackets',
      }],
    },
  },
);
