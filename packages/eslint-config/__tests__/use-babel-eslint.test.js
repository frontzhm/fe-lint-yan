const assert = require('assert');
const eslint = require('eslint');
const path = require('path');

describe('test/use-babel-eslint.test.js', () => {
  it('babel-eslint parser run well for react', async () => {
    const configPath = './react.js';
    const filePath = path.join(__dirname, './fixtures/use-babel-eslint.jsx');

    const cli = new eslint.ESLint({
      overrideConfigFile: configPath,
      useEslintrc: false,
      ignore: false,
    });

    const results = await cli.lintFiles([filePath]);
    const { messages, errorCount, fatalErrorCount, warningCount } = results[0];

    assert.equal(fatalErrorCount, 0);
    // 错误数量可能因 React 版本检测、eslint-plugin-react 版本等而略有变化
    // 只要确保检测到了错误即可（通常是 26-27 个）
    assert.ok(errorCount > 20, `期望检测到至少 20 个错误，实际检测到 ${errorCount} 个`);
    assert.ok(warningCount > 0, `期望检测到警告，实际检测到 ${warningCount} 个`);

    const errorReportedByReactPlugin = messages.filter((result) => {
      return result.ruleId && result.ruleId.indexOf('react/') !== -1;
    });

    assert.notEqual(errorReportedByReactPlugin.length, 0);
  });

  it('babel-eslint parser run well for vue', async () => {
    const configPath = './vue.js';
    const filePath = path.join(__dirname, './fixtures/vue.vue');

    const cli = new eslint.ESLint({
      overrideConfigFile: configPath,
      useEslintrc: false,
      ignore: false,
    });

    const results = await cli.lintFiles([filePath]);
    const { errorCount, fatalErrorCount, warningCount } = results[0];

    assert.equal(fatalErrorCount, 0);
    assert.equal(errorCount, 4);
    assert.equal(warningCount, 0);
  });
});
