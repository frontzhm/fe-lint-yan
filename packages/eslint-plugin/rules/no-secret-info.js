// 默认危险关键字
const DEFAULT_DANGEROUS_KEYS = ['secret', 'token', 'password'];

module.exports = {
  meta: {
    type: 'problem',
    fixable: null,
    docs: {
      description: '禁止使用敏感信息',
      recommended: true,
    },
    messages: {
      noSecretInfo: 'Detect that the "{{secret}}" might be a secret token, Please check!',
    },
  },

  create(context) {
    // 获取规则选项
    const ruleOptions = context.options[0] || {};
    // 如果危险关键字为空，则使用默认危险关键字
    let { dangerousKeys = [], autoMerge = true } = ruleOptions;
    // 如果自动合并，则合并默认危险关键字和自定义危险关键字
    if (dangerousKeys.length === 0) {
      dangerousKeys = DEFAULT_DANGEROUS_KEYS;
    } else if (autoMerge) {
      dangerousKeys = [...new Set([...DEFAULT_DANGEROUS_KEYS, ...dangerousKeys])];
    }
    // 将危险关键字数组转换为正则表达式
    // 例如：['secret', 'token', 'password'] -> /secret|token|password/
    // 这个正则表达式可以匹配包含任意一个关键字的字符串
    const reg = new RegExp(dangerousKeys.join('|'));

    return {
      Literal: function handleRequires(node) {
        // 检查节点值是否存在
        if (!node.value || !node.parent) {
          return;
        }

        // 获取变量名或属性名
        let nameToCheck = null;
        if (node.parent.type === 'VariableDeclarator') {
          // var/const/let 声明的变量名
          nameToCheck = node.parent.id?.name;
        } else if (node.parent.type === 'Property') {
          // 对象属性的键名
          nameToCheck = node.parent.key?.name;
        }

        // 如果名称包含危险关键字，则报告错误
        if (nameToCheck && reg.test(nameToCheck.toLowerCase())) {
          context.report({
            node,
            messageId: 'noSecretInfo',
            data: {
              secret: node.value,
            },
          });
        }
      },
    };
  },
};

/**
// 代码示例
const mySecret = 'abc123';

// AST 结构：
// VariableDeclaration (声明类型：var/const/let)
//   ├── kind: 'const'          // 声明方式
//   └── declarations: [
//       VariableDeclarator {    // ← node.parent 指向这里
//         id: Identifier {       // ← node.parent.id 指向这里
//           name: 'mySecret'     // ← node.parent.id.name 就是 'mySecret'
//         },
//         init: Literal {        // ← node 指向这里（字符串字面量）
//           value: 'abc123'
//         }
//       }
//     ]
 */