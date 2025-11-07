// 1. 定义规则对象
module.exports = {
  // 3. 规则的元数据信息
  meta: {
    // 3.1 规则类型
    // - 'problem': 可能导致错误的代码（错误级别）
    // - 'suggestion': 建议改进的代码（建议级别）
    // - 'layout': 代码格式相关（风格级别）
    type: 'suggestion',
    // 在 IDE 中显示规则的描述
    docs: {
      // 必需：规则的简短描述
      description: '禁止使用 HTTP 协议的 URL，推荐使用 HTTPS',
  
      // 可选：是否在推荐配置中启用
      // - true: 包含在推荐配置中
      // - false: 不包含在推荐配置中
      // - undefined: 不标记为推荐
      recommended: true,
    },

    // 3.2 是否支持自动修复
    // - 'code': 可以修复代码
    // - 'whitespace': 只能修复空白字符
    // - null: 不支持自动修复
    fixable: null,

    // 3.3 错误消息模板
    // 使用 messageId 可以更好地管理多语言和消息模板，和context.report的messageId对应
    messages: {
      noHttpUrl: 'Recommended "{{url}}" switch to HTTPS',
      // {{url}} 是占位符，会在 report 时被 data.url 替换
    },
  },

  // 4. 规则的核心逻辑函数
  // context 是 ESLint 提供的上下文对象，包含很多有用的 API
  create(context) {
    // 4.1 返回一个对象，对象的键是 AST 节点类型
    // ESLint 会在遍历 AST 时，遇到对应类型的节点就调用对应的处理函数 (访问者模式)
    return {
      // 4.2 Literal 是字面量节点类型
      // 例如：字符串 'hello'、数字 123、布尔值 true 等
      Literal: function handleRequires(node) {
        // 4.3 检查节点的值
        // node.value 是字面量的值，例如：'http://example.com' 的值是 'http://example.com'
        if (
          node.value && // 值存在
          typeof node.value === 'string' && // 是字符串类型
          node.value.startsWith('http://') // 以 'http://' 开头（而不是 'https://'）
        ) {
          // 4.4 报告错误
          context.report({
            node, // 出错的节点（会在错误信息中高亮显示）
            messageId: 'noHttpUrl', // 使用 meta.messages 中定义的消息 ID，也就是key
            data: {
              // 传递给消息模板的数据
              url: node.value, // {{url}} 会被替换为 node.value
            },
          });
        }
      },
    };
  },
};