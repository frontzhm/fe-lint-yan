const { RuleTester } = require('eslint');

const ruleTester = new RuleTester();

ruleTester.run('no-http-url', require('../rules/no-http-url'), {
  // 测试通过的代码
  valid: [
    {
      code: "var test = 'https://yan.com';",
    },
  ],

  // 测试不通过的代码
  invalid: [
    {
      // 应触发规则的代码
      code: "var test = 'http://yan.com';",
      // 规则自动修复后的预期代码
      // 若规则不支持自动修复（该规则 fixable: null），output 应与 code 相同，表示不修复
      output: "var test = 'http://yan.com';",
      // 预期错误列表，需与规则中 meta.messages 一致
      errors: [
        {
          message: 'Recommended "http://yan.com" switch to HTTPS',
        },
      ],
    },
    {
      code: "<img src='http://yan.com' />",
      output: "<img src='http://yan.com' />",
      // 可选：指定代码解析器选项，例如 JSX 解析器
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      errors: [
        {
          message: 'Recommended "http://yan.com" switch to HTTPS',
        },
      ],
    },
  ],
});