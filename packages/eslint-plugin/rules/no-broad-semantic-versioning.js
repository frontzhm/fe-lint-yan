const path = require('path');

module.exports = {
  meta: {
    type: 'problem', // 错误级别
    fixable: null, // 不支持自动修复
    docs: {
      description: '禁止使用宽松的语义版本号',
      recommended: true,
    },
    messages: { 
      // 错误消息模板
      noBroadSemanticVersioning:
        // {{dependencyName}} 是占位符，会在 report 时被 data.dependencyName 替换
        // {{versioning}} 是占位符，会在 report 时被 data.versioning 替换
        'The "{{dependencyName}}" is not recommended to use "{{versioning}}"',
    },
  },

  create(context) {
    const isPackageJson =
      path.basename(context.getFilename()) === 'package.json';
    if (!isPackageJson) {
      return {};
    }

    return {
      // Property 是属性节点类型
      // 例如：{ dependencies: { 'eslint': '8.57.0' } } 中的 'dependencies'
      Property: function handleRequires(node) {
        // 检查是否为 dependencies 或 devDependencies
        const isDependencies = node?.key?.value === 'dependencies';
        const isDevDependencies = node?.key?.value === 'devDependencies';
        if (isDependencies || isDevDependencies) {
          const { properties } = node?.value;
          properties?.forEach((property) => {
            if (property?.key?.value) {
              // 获取依赖名称和版本号
              const dependencyName = property?.key?.value;
              const dependencyVersion = property?.value?.value;
              // 检查是否为宽泛的语义版本：*、x、> 等
              const isBroadSemanticVersioning = /[*x>]/.test(dependencyVersion);
              if (isBroadSemanticVersioning) {
                context.report({
                  loc: property.loc,
                  messageId: 'noBroadSemanticVersioning',
                  data: {
                    dependencyName,
                    versioning: dependencyVersion,
                  },
                });
              }
            }
          });
        }
      },
    };
  },
};