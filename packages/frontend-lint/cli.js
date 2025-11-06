const { program } = require('commander');

program
  .name('yan-frontend-lint')
  .description('自定义的前端编码规范工程化配套 Lint 工具')
  .version('1.0.0')


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

