# Commander.js action 参数说明

## `cmd` 参数是什么？

在 Commander.js 中，`action` 回调函数的参数取决于你如何定义命令：

### 情况 1: 只有选项（options），没有参数（arguments）

```javascript
program
  .command('init')
  .option('-v, --vscode', '使用 VSCode 配置')
  .action((cmd) => {
    // cmd 就是 options 对象
    console.log(cmd.vscode); // true 或 false
  });
```

**此时 `cmd` 就是 options 对象**，包含所有定义的选项。

### 情况 2: 有参数（arguments）和选项（options）

```javascript
program
  .command('init <name>')
  .option('-v, --vscode', '使用 VSCode 配置')
  .action((name, cmd) => {
    // 第一个参数是 arguments
    console.log(name); // 'myName'
    // 第二个参数是 options 对象
    console.log(cmd.vscode); // true 或 false
  });
```

**此时第一个参数是 arguments，第二个参数是 options 对象**。

## `cmd` 对象通常包含哪些属性？

`cmd`（options 对象）包含：

1. **所有定义的选项**：通过 `.option()` 定义的选项
   ```javascript
   .option('-v, --vscode', '使用 VSCode 配置')
   .option('-p, --path <path>', '路径选项')
   // cmd = { vscode: true, path: '/some/path' }
   ```

2. **内置属性**（Commander.js 自动添加）：
   - `cmd.opts()`: 获取所有选项
   - `cmd.parent`: 父命令对象
   - 其他 Commander 内部属性

## 示例

```javascript
program
  .command('init')
  .description('初始化项目')
  .option('-v, --vscode', '使用 VSCode 配置')
  .option('-f, --force', '强制初始化')
  .option('-p, --path <path>', '指定路径', './')
  .action(async (cmd) => {
    // cmd 对象包含：
    // - cmd.vscode: true/false（如果用户使用了 --vscode 选项）
    // - cmd.force: true/false（如果用户使用了 --force 选项）
    // - cmd.path: 字符串（用户指定的路径，默认 './'）
    
    if (cmd.vscode) {
      // 使用 VSCode 配置
    }
    
    if (cmd.force) {
      // 强制初始化
    }
    
    const path = cmd.path || './';
  });
```

## 使用方式

```bash
# 使用 --vscode 选项
node cli.js init --vscode

# 使用多个选项
node cli.js init --vscode --force --path /custom/path

# 不使用选项
node cli.js init
```

## 注意事项

1. **选项必须定义**：如果代码中使用了 `cmd.vscode`，必须先通过 `.option()` 定义
2. **选项名称**：`--vscode` 对应 `cmd.vscode`，`--vscode-config` 对应 `cmd.vscodeConfig`
3. **布尔选项**：`--vscode` 这样的选项，使用时为 `true`，不使用时为 `undefined` 或 `false`
4. **带值的选项**：`--path <path>` 这样的选项，值是字符串类型

