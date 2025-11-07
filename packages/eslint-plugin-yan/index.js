
const fs = require('fs');
const path = require('path');
const packageJson = require('./package.json');

// 从 package.json 读取元数据
const pluginName = packageJson.name;
const pluginVersion = packageJson.version;
// 从插件名称中提取命名空间（去掉 'eslint-plugin-' 前缀）
const namespace = pluginName.replace(/^eslint-plugin-/, '');

// 自动加载 rules 目录下的所有规则文件
const rules = (() => {
  const rulesDir = path.join(__dirname, 'rules');
  let _rules = {};
  if (fs.existsSync(rulesDir)) {
    const ruleFiles = fs.readdirSync(rulesDir).filter((file) => {
      return file.endsWith('.js') && !file.startsWith('.');
    });

    ruleFiles.forEach((file) => {
      const ruleName = file.replace(/\.js$/, '');
      const rulePath = path.join(rulesDir, file);
      _rules[ruleName] = require(rulePath);
    });
  }
  return _rules;
})();

module.exports = {
  meta: {
    name: pluginName,
    version: pluginVersion,
    namespace,
  },
  rules,
  configs: {
    recommended: {
      rules: {
        'yan/no-http-url': 'warn',
        'yan/no-secret-info': 'error',
        'yan/no-broad-semantic-versioning': 'error',
        'yan/no-js-in-ts-project': 'warn',
      },
    },
  },
};