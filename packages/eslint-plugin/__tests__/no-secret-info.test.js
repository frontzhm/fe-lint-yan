const { RuleTester } = require('eslint');

const ruleTester = new RuleTester({
  // 指定解析器选项
  parserOptions: {
    ecmaVersion: 2015, // 支持 ES6+ (const, let)
  },
});

ruleTester.run('no-secret-info', require('../rules/no-secret-info'), {
  valid: [
    // 正常的变量名，不包含危险关键字
    {
      code: "const apiKey = 'normal-key';",
    },
    {
      code: "let username = 'user123';",
    },
    {
      code: "var data = 'some-data';",
    },
    // 对象属性，不包含危险关键字
    {
      code: "const config = { apiUrl: 'https://api.com' };",
    },
  ],

  invalid: [
    // var 声明 - 包含 secret 关键字
    {
      code: "var mySecret = 'abc123';",
      errors: [
        {
          messageId: 'noSecretInfo',
        },
      ],
    },
    // const 声明 - 包含 token 关键字
    {
      code: "const apiToken = 'xyz789';",
      errors: [
        {
          messageId: 'noSecretInfo',
        },
      ],
    },
    // let 声明 - 包含 password 关键字
    {
      code: "let userPassword = 'pass456';",
      errors: [
        {
          messageId: 'noSecretInfo',
        },
      ],
    },
    // 对象属性 - 包含 secret 关键字
    {
      code: "const config = { secretKey: 'key123' };",
      errors: [
        {
          messageId: 'noSecretInfo',
        },
      ],
    },
  ],
});

