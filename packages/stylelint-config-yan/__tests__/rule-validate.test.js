const assert = require('assert');
const stylelint = require('stylelint');
const path = require('path');
const postcssScss = require('postcss-scss');
const postcssLess = require('postcss-less');

// 辅助函数：执行 stylelint lint
async function lintFile(fileName, options = {}) {
  const filePaths = [path.join(__dirname, './fixtures', fileName)];
  const configFile = path.join(__dirname, '../index.js');

  const result = await stylelint.lint({
    configFile,
    files: filePaths,
    fix: false,
    ...options,
  });

  return {
    result,
    filePaths,
    warnings: result.results[0]?.warnings || [],
  };
}

// 辅助函数：打印错误信息（仅在需要时）
function logWarnings(filePaths, warnings) {
  if (warnings.length > 0) {
    console.log(`========= ${filePaths} ==========`);
    warnings.forEach(w => {
      console.log(`Line ${w.line}:${w.column} - [${w.rule}] ${w.text}`);
    });
  }
}

describe('test/rules-validate.test.js', () => {
  it('Validate default', async () => {
    const { result, filePaths, warnings } = await lintFile('index.css');

    // 打印错误信息（可选）
    logWarnings(filePaths, warnings);

    // index.css 应该检测到 22 个错误
    assert.ok(warnings.length === 22, `应该检测到 22 个 stylelint 错误，实际检测到 ${warnings.length} 个`);
  });

  it('Validate sass', async () => {
    const { result, filePaths, warnings } = await lintFile('sass-test.scss', {
      customSyntax: postcssScss,
    });

    logWarnings(filePaths, warnings);

    // sass-test.scss 应该检测到 2 个错误
    assert.ok(warnings.length === 2, `sass-test.scss 应该检测到 2 个 stylelint 错误，实际检测到 ${warnings.length} 个`);
  });

  it('Validate less', async () => {
    const { result, filePaths, warnings } = await lintFile('less-test.less', {
      customSyntax: postcssLess,
    });

    logWarnings(filePaths, warnings);

    // less-test.less 应该检测到 2 个错误
    assert.ok(warnings.length === 2, `less-test.less 应该检测到 2 个 stylelint 错误，实际检测到 ${warnings.length} 个`);
  });

  it('Validate css-module', async () => {
    const { result, filePaths, warnings } = await lintFile('css-module.scss', {
      customSyntax: postcssScss,
    });

    logWarnings(filePaths, warnings);

    // css-module.scss 应该通过所有检查（0 个错误）
    assert.ok(warnings.length === 0, `css-module.scss 应该通过所有检查（0 个错误），实际检测到 ${warnings.length} 个错误`);
  });
});