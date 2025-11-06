# yan-frontend-lint

`yan-frontend-lint` 是[自定义的前端编码规范工程化](https://frontzhm.github.io/frontend-lint/)的配套 Lint 工具，可以为项目一键接入规范、一键扫描和修复规范问题，保障项目的编码规范和代码质量。

## 背景

前期引入了多个业界流行的 Linter，并根据规范内容定制了规则包，主要包括：

| 规范                                                              | Lint 工具                                                             | npm 包                                                                           |
| ----------------------------------------------------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| JavaScript 编码规范 <br/> TypeScript 编码规范 <br/> Node 编码规范 | [ESLint](https://eslint.org/)                                         | [yan-eslint-config](https://www.npmjs.com/package/yan-eslint-config)             |
| CSS 编码规范                                                      | [stylelint](https://stylelint.io/)                                    | [yan-stylelint-config](https://www.npmjs.com/package/yan-stylelint-config)       |
| Git 规范                                                          | [commitlint](https://commitlint.js.org/#/)                            | [yan-commitlint-config](https://www.npmjs.com/package/yan-commitlint-config)     |
| markdown文档规范                                                  | [markdownlint](https://github.com/DavidAnson/markdownlint)            | [yan-markdownlint-config](https://www.npmjs.com/package/yan-markdownlint-config) |
| 自定义 ESLint 插件                                                | [eslint-plugin](https://eslint.org/docs/latest/use/configure/plugins) | [eslint-plugin-yan](https://www.npmjs.com/package/eslint-plugin-yan)             |

可以看到这些 `Linter` 和规则包众多且零散，全部安装它们会给项目增加十几个依赖，接入和升级成本都比较高。

`yan-frontend-lint` 收敛屏蔽了这些依赖和配置细节，提供简单的 `CLI` 和 `Node.js API`，让项目能够一键接入、一键扫描、一键修复、一键升级，并为项目配置 `git commit` 卡口，降低项目接入规范的成本。

分几个阶段来实现项目：

- 初始化项目：初始化项目，安装依赖，生成配置文件
- 扫描项目：扫描项目，检查代码规范
- 修复项目：修复项目，修复代码规范
- commit 卡口：配置 git commit 卡口，在 git commit 时会运行 `yan-frontend-lint commit-file-scan` 和 `yan-frontend-lint commit-msg-scan` 分别对提交文件和提交信息进行规范检查
- Node.js API：提供 Node.js API，方便在项目中使用

## 初始化项目

```bash
cd packages
mkdir frontend-lint
cd frontend-lint
pnpm init
```

### `package.json` 文件

```json
{
  "name": "yan-frontend-lint",
  "version": "1.0.0",
  "description": "自定义的前端编码规范工程化配套 Lint 工具",
  "keywords": ["frontend", "lint", "frontend-lint", "yan-frontend-lint"],
  "main": "index.js",
  "bin": "cli.js",
  "files": ["index.js", "cli.js", "README.md"],
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "frontzhm@163.com",
  "homepage": "https://github.com/frontzhm/frontend-lint#readme",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/frontzhm/frontend-lint.git"
  },
  "bugs": {
    "url": "https://github.com/frontzhm/frontend-lint/issues"
  }
}
```

填写基本信息，后期还需要补充更多信息。

这边因为支持cli，所以需要补充cli.js文件。
cli的本质是，解析命令行参数，并调用相应的函数。
比如别人执行 `yan-frontend-lint init`，其实就是`node cli.js init`。

### 补充index.js和cli.js文件

```bash
touch index.js cli.js
```

在index.js文件中，补充如下内容：

```javascript
module.exports = {
  init: () => {
    console.log('init');
  },
  scan: () => {
    console.log('scan');
  },
  fix: () => {
    console.log('fix');
  },
  commit: () => {
    console.log('commit');
  },
};
```

在cli.js文件中，补充如下内容：

```javascript
const { program } = require('commander');

program
  .name('yan-frontend-lint')
  .description('自定义的前端编码规范工程化配套 Lint 工具')
  .version('1.0.0');

program
  .command('init')
  .description('初始化项目')
  .action(() => {
    console.log('初始化项目');
  });

program
  .command('scan')
  .description('扫描项目')
  .action(() => {
    console.log('扫描项目');
  });

program
  .command('fix')
  .description('修复项目')
  .action(() => {
    console.log('修复项目');
  });

program
  .command('commit')
  .description('提交项目')
  .action(() => {
    console.log('提交项目');
  });

program.parse(process.argv);
```

### 安装commander

commander包，用于解析命令行参数，并调用相应的函数。

```bash
pnpm install commander -D
```

现在运行命令 `node cli.js`，会看到如下输出：

```bash
$ node cli.js
Usage: yan-frontend-lint [options] [command]

自定义的前端编码规范工程化配套 Lint 工具

Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  init            初始化项目
  scan            扫描项目
  fix             修复项目
  commit          提交项目
  help [command]  display help for command
```

运行命令 `node cli.js init`，会看到如下输出：

```bash
$ node cli.js init
初始化项目
```

这样就有了框架，后续就是补充功能了。

### 补充init功能

预期功能：

![lint_cli_1.png](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/lint_cli_1.png)

- 检查是不是最新版本
- 按提示选择要接入的规范
- 安装依赖
- 生成配置文件
- 打印成功信息

#### 检查是不是最新版本

检查是不是最新版本的步骤：

1. 获取包管理器（npm/pnpm）
2. 执行 `npm view encode-fe-lint version` 获取最新版本
3. 比较本地版本和最新版本
4. 将版本号按 . 分割并转为数字数组（如 "1.2.3" → [1, 2, 3]）
5. 逐位比较：
6. 本地某位更大：返回 null（本地更新）
7. 本地某位更小：返回 latestVersion（有新版本）
8. 相等：继续下一位
9. 注意：如果所有位都相等，函数会返回 undefined（可能是个小 bug，应返回 null）。

1.1 怎么获取包管理器？
用 `which pnpm` 命令检查 pnpm 是否可用，不可用返回 'npm'，可用返回 'pnpm'

```js
/**
 * 读取本地包管理器
 * @returns 'pnpm' | 'npm'
 */
function getPackageManagerLocal() {
  try {
    // 尝试执行 which pnpm 命令
    require('child_process').execSync('which pnpm', { stdio: 'ignore' });
    return 'pnpm';
  } catch (error) {
    // pnpm 不存在，返回 npm
    return 'npm';
  }
}
```

1.2 怎么获取最新版本？

使用 `npm view` 命令获取最新版本

```js
/**
 * 获取包的最新版本
 * @param {string} packageName - 包名，默认为 'yan-frontend-lint'
 * @returns {string|null} 最新版本号，获取失败返回 null
 */
function getLatestVersion(packageName = 'yan-frontend-lint') {
  try {
    // 使用 npm view 命令获取最新版本
    const command = `npm view ${packageName} version`;
    const version = require('child_process')
      .execSync(command, {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'], // 忽略 stdin 和 stderr，只捕获 stdout
      })
      .trim();
    return version || null;
  } catch (error) {
    // 获取失败（网络问题、包不存在等）
    console.error(`获取 ${packageName} 最新版本失败:`, error.message);
    return null;
  }
}
```

1.3 怎么检查本地有没有安装这个包？
使用 `npm list` 命令检查本地有没有安装这个包

```js
/**
 * 检查包是否已安装（全局）
 * @param {Object} { packageManager = 'npm', packageName = 'yan-frontend-lint' } - 包管理器和包名
 * @returns {boolean} 是否已安装
 */
function isPackageInstalledLocal({ packageManager, packageName }) {
  try {
    const command = `${packageManager} list -g ${packageName} --depth=0`;
    const output = require('child_process').execSync(command, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });

    // 检查输出中是否包含包名
    const escapedName = packageName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(escapedName).test(output);
  } catch (error) {
    // 命令执行失败，说明包未安装
    return false;
  }
}
```

1.4 怎么获取本地版本？
使用 `npm list` 命令获取本地版本

```js
/**
 * 获取本地安装的包版本
 * @param {Object} { packageManager = 'npm', packageName = 'yan-frontend-lint' } - 包管理器和包名
 * @returns {string} 本地版本号，获取失败返回 ''
 */
function getLocalVersion({
  packageManager = 'npm',
  packageName = 'yan-frontend-lint',
} = {}) {
  try {
    const command = `${packageManager} list -g ${packageName} --depth=0`;
    const output = require('child_process').execSync(command, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });

    // 解析输出，查找版本号
    // 输出格式可能是: yan-frontend-lint@1.0.0 或 /path/to/node_modules/yan-frontend-lint@1.0.0
    const versionMatch = output.match(
      new RegExp(
        `${packageName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}@([\\d.]+)`
      )
    );
    if (versionMatch && versionMatch[1]) {
      return versionMatch[1];
    }
    return '';
  } catch (error) {
    console.error(`获取 ${packageName} 本地版本失败:`, error.message);
    return '';
  }
}
```

1.5 怎么比较本地版本和最新版本？

比较本地版本和最新版本的步骤：

1. 将版本号按 . 分割并转为数字数组（如 "1.2.3" → [1, 2, 3]）
2. 获取最大长度，补齐较短的版本号
3. 逐位比较：
4. 本地某位更大：返回 true（本地更新）
5. 本地某位更小：返回 false（有新版本）
6. 相等：继续下一位
7. 注意：如果所有位都相等，函数会返回 true（已是最新版本）。

```js
/**
 * 比较两个版本号
 * @param {Object} { localVersion: string, latestVersion: string } - 本地版本号和最新版本号
 * @returns {boolean|null}
 *   - true: 本地版本 >= 最新版本（已是最新版本）
 *   - false: 本地版本 < 最新版本（有新版本）
 *   - null: 任一版本为空，无法比较
 */

function detectIsLatestVersion({ localVersion, latestVersion } = {}) {
  // 如果任一版本为空，无法比较
  if (!localVersion || !latestVersion) {
    return null;
  }
  if (localVersion === latestVersion) {
    return true;
  }

  // 将版本号按 . 分割并转为数字数组（如 "1.2.3" → [1, 2, 3]）
  const localParts = localVersion.split('.').map(Number);
  const latestParts = latestVersion.split('.').map(Number);

  // 获取最大长度，补齐较短的版本号
  const maxLen = Math.max(localParts.length, latestParts.length);

  // 逐位比较
  for (let i = 0; i < maxLen; i++) {
    const localNum = localParts[i] || 0;
    const latestNum = latestParts[i] || 0;

    // 本地某位更大：返回 true（本地更新）
    if (localNum > latestNum) {
      return true;
    }

    // 本地某位更小：返回 false（有新版本）
    if (localNum < latestNum) {
      return false;
    }

    // 相等：继续下一位
  }

  // 所有位都相等，返回 true（已是最新版本）
  return true;
}
```
