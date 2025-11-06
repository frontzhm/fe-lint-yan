const { program } = require('commander');
const init = require('./commands/init');

program
  .name('yan-frontend-lint')
  .description('自定义的前端编码规范工程化配套 Lint 工具')
  .version('1.0.0')


program
  .command('init')
  .description('初始化项目')
  .action(async (cmd) => {
    await init({cwd: require('process').cwd(), checkVersionUpdate: true});
    
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

