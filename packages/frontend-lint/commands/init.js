function init({ cwd = require('process').cwd(), checkVersionUpdate = false }) {

  if (checkVersionUpdate) {
    checkVersion();
  }
  console.log('init', cwd, checkVersionUpdate);
  console.log('初始化项目成功');
}

/**
 * 作用：检查并比较版本号
步骤：
1.获取包管理器（npm/pnpm）
2.执行 npm view encode-fe-lint version 获取最新版本
3.如果本地版本等于最新版本，返回 null
4.将版本号按 . 分割并转为数字数组（如 "1.2.3" → [1, 2, 3]）
5.逐位比较：
6.本地某位更大：返回 null（本地更新）
7.本地某位更小：返回 latestVersion（有新版本）
8.相等：继续下一位
9.注意：如果所有位都相等，函数会返回 undefined（可能是个小 bug，应返回 null）。



作用：检查版本并可选自动更新
参数：
install（默认 true）：是否自动安装
流程：
显示“正在检查最新版本...”的加载动画
调用 checkLatestVersion() 获取最新版本
根据结果处理：
有新版本且 install === true：显示升级提示，执行 npm i -g encode-fe-lint 全局安装
有新版本但 install === false：仅警告，提示手动升级
无新版本且 install === true：提示“当前没有可用的更新”
无新版本且 install === false：不输出
异常处理：停止动画并输出错误
 */
function checkVersion() {

  const packageManager = getPackageManagerLocal();
  console.log('packageManager', packageManager);
  
}
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
module.exports = init;