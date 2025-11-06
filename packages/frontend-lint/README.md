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
