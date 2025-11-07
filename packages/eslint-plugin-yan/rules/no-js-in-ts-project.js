const path = require('path');

// 默认白名单
const DEFAULT_WHITE_LIST = [
  'commitlint.config.js',
  'eslintrc.js',
  'prettierrc.js',
  'stylelintrc.js',
];

module.exports = {
  meta: {
    type: 'suggestion',
    fixable: null,
    docs: {
      description: '禁止在TS项目中使用JS文件',
      recommended: true,
    },
    messages: {
      noJSInTSProject: 'The "{{fileName}}" is not recommended in TS project',
    },
  },

  create(context) {
    const fileName = context.getFilename();
    const extName = path.extname(fileName);
    const ruleOptions = context.options[0] || {};
    let { whiteList = [], autoMerge = true } = ruleOptions;
    // 如果白名单为空，则使用默认白名单
    if (whiteList.length === 0) {
      whiteList = DEFAULT_WHITE_LIST;
    } else if (autoMerge) {
      // 如果自动合并，则合并默认白名单和自定义白名单
      whiteList = [...new Set([...DEFAULT_WHITE_LIST, ...whiteList])]; // 去重
    }
    // 创建白名单正则表达式
    const whiteListReg = new RegExp(`(${whiteList.join('|')})$`);

    // 如果文件名不在白名单中，并且文件扩展名是 JS 或 JSX
    if (!whiteListReg.test(fileName) && /\.jsx?$/.test(extName)) {
      // 报告错误
      context.report({
        loc: {
          start: {
            line: 0,
            column: 0,
          },
          end: {
            line: 0,
            column: 0,
          },
        },
        messageId: 'noJSInTSProject',
        data: {
          fileName,
        },
      });
    }

    // Necessary
    return {};
  },
};