const { consola } = require('consola');
const { execSync } = require('child_process');
const ora = require('ora');
const { default: inquirer } = require('inquirer');
const path = require('path');
const fs = require('fs');
const { name: pkgName, version: pkgVersion } = require('../package.json');

const PROJECT_TYPES = [
  {
    name: '未使用 React、Vue、Node.js 的项目（JavaScript）',
    value: 'index',
  },
  {
    name: '未使用 React、Vue、Node.js 的项目（TypeScript）',
    value: 'typescript',
  },
  {
    name: 'React 项目（JavaScript）',
    value: 'react',
  },
  {
    name: 'React 项目（TypeScript）',
    value: 'typescript/react',
  },
  {
    name: 'Rax 项目（JavaScript）',
    value: 'rax',
  },
  {
    name: 'Rax 项目（TypeScript）',
    value: 'typescript/rax',
  },
  {
    name: 'Vue 项目（JavaScript）',
    value: 'vue',
  },
  {
    name: 'Vue 项目（TypeScript）',
    value: 'typescript/vue',
  },
  {
    name: 'Node.js 项目（JavaScript）',
    value: 'node',
  },
  {
    name: 'Node.js 项目（TypeScript）',
    value: 'typescript/node',
  },
  {
    name: '使用 ES5 及之前版本 JavaScript 的老项目',
    value: 'es5',
  },
];

/**
 * 初始化项目
 * @param {Object} [options={}] - 选项对象
 * @param {string} [options.cwd=process.cwd()] - 工作目录，默认为当前目录
 * @param {boolean} [options.isAutoUpdate=false] - 是否自动更新，默认为 false
 */
async function init(options = {}) {
  const { cwd = process.cwd(), isAutoUpdate = false } = options;
  // 1. 检查版本
  await checkAndUpdateVersion({ isAutoUpdate });

  // 2. 初始化项目配置
  await initProjectConfig({ cwd });
}

/**
 * 检查并更新版本
 * @param {Object} [options={}] - 选项对象
 * @param {boolean} [options.isAutoUpdate=false] - 是否自动更新
 */
async function checkAndUpdateVersion(options = {}) {
  const { isAutoUpdate = false } = options;
  const spinner = ora('正在检查版本...').start();

  try {
    const { isInstalled, localVersion, latestVersion, isLatestVersion, packageManager } =
      checkVersionIsLatest(pkgName);

    spinner.stop();

    // 如果未安装
    if (!isInstalled) {
      consola.error(`请先全局安装包 ${pkgName}`);
      consola.info(`运行: ${packageManager} install -g ${pkgName}`);
      return;
    }

    // 如果不是最新版本
    if (!isLatestVersion && latestVersion) {
      if (isAutoUpdate) {
        // 自动更新模式：提示并执行安装
        consola.warn(`${pkgName} 存在新版本，当前版本: ${localVersion}，最新版本: ${latestVersion}`);

        const updateSpinner = ora(`正在升级至 ${latestVersion}...`).start();

        try {
          const installCommand = `${packageManager} install -g ${pkgName}@${latestVersion}`;
          execSync(installCommand, { stdio: 'pipe' });
          updateSpinner.succeed(`升级成功！当前版本: ${latestVersion}`);
        } catch (error) {
          updateSpinner.fail(`升级失败: ${error.message}`);
          return;
        }
      } else {
        // 非自动更新模式：仅提示
        consola.warn(`${pkgName} 存在新版本`);
        consola.info(`当前版本: ${localVersion}`);
        consola.info(`最新版本: ${latestVersion}`);
        consola.info(`运行: ${packageManager} install -g ${pkgName}@${latestVersion} 进行升级`);
      }
    } else if (isLatestVersion) {
      // 如果已是最新版本
      consola.success(`当前版本已是最新版本: ${localVersion}`);
    }
  } catch (error) {
    spinner.fail('版本检查失败');
    consola.error(error.message);
  }
}

/**
 * 初始化项目配置
 * @param {Object} [options={}] - 选项对象
 * @param {string} [options.cwd] - 工作目录
 */
async function initProjectConfig(options = {}) {
  const { cwd = process.cwd() } = options;
  consola.info('开始初始化项目配置...');
  // 获取项目根目录的配置文件`.yan-lint.config.js`
  const configFilePath = path.join(cwd, `.${pkgName}.config.js`);
  // 或者`yan-lint.config.js`
  const configFilePath2 = path.join(cwd, `${pkgName}.config.js`);

  if (fs.existsSync(configFilePath) || fs.existsSync(configFilePath2)) {
    consola.info(`${pkgName} 项目配置文件已存在，跳过初始化`);
    return;
  }
  let step = 0;


  const { type: eslintType } = await inquirer.prompt({
    type: 'list',
    name: 'type',
    message: `Step ${++step}. 请选择项目的语言（JS/TS）和框架（React/Vue）类型：`,
    choices: PROJECT_TYPES,
  });
  const { enable: enableStylelint } = await inquirer.prompt({
    type: 'confirm',
    name: 'enable',
    message: `Step ${++step}. 是否需要使用 stylelint（若没有样式文件则不需要）：`,
    default: true,
  });

const { enable: enableMarkdownlint } = await inquirer.prompt({
  type: 'confirm',
  name: 'enable',
  message: `Step ${++step}. 是否需要使用 markdownlint（若没有 Markdown 文件则不需要）：`,
  default: true,
});
const { enable: enablePrettier } = await inquirer.prompt({
  type: 'confirm',
  name: 'enable',
  message: `Step ${++step}. 是否需要使用 Prettier 格式化代码：`,
  default: true,
});


  consola.info(`你选择了: ${eslintType}`);

  consola.success('项目配置初始化完成');
}

// ==================== 版本检查相关函数 ====================

/**
 * 检查版本是否是最新版本
 * @param {string} packageName - 包名，默认为从 package.json 读取
 * @returns {Object} 版本信息对象
 */
function checkVersionIsLatest(packageName = pkgName) {
  const packageManager = getPackageManagerLocal();
  const latestVersion = getLatestVersion(packageName);
  const isInstalled = isPackageInstalledLocal({ packageManager, packageName });
  const localVersion = getLocalVersion({ packageManager, packageName });
  const isLatestVersion = detectIsLatestVersion({ localVersion, latestVersion });

  return {
    isInstalled,
    localVersion,
    latestVersion,
    isLatestVersion,
    packageManager,
  };
}

/**
 * 比较两个版本号
 * @param {Object} options - 选项对象
 * @param {string} options.localVersion - 本地版本号
 * @param {string} options.latestVersion - 最新版本号
 * @returns {boolean} true: 本地版本 >= 最新版本，false: 本地版本 < 最新版本
 */
function detectIsLatestVersion({ localVersion, latestVersion } = {}) {
  if (!localVersion || !latestVersion) {
    return false;
  }

  if (localVersion === latestVersion) {
    return true;
  }

  const localParts = localVersion.split('.').map(Number);
  const latestParts = latestVersion.split('.').map(Number);
  const maxLen = Math.max(localParts.length, latestParts.length);

  for (let i = 0; i < maxLen; i++) {
    const localNum = localParts[i] || 0;
    const latestNum = latestParts[i] || 0;

    if (localNum > latestNum) return true;
    if (localNum < latestNum) return false;
  }

  return true;
}

/**
 * 获取包的最新版本
 * @param {string} packageName - 包名
 * @returns {string|null} 最新版本号，获取失败返回 null
 */
function getLatestVersion(packageName = pkgName) {
  try {
    const command = `npm view ${packageName} version`;
    const version = execSync(command, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
    return version || null;
  } catch (error) {
    return null;
  }
}

/**
 * 获取本地安装的包版本
 * @param {Object} options - 选项对象
 * @param {string} options.packageManager - 包管理器
 * @param {string} options.packageName - 包名
 * @returns {string} 本地版本号，获取失败返回 ''
 */
function getLocalVersion({ packageManager = 'npm', packageName = pkgName } = {}) {
  try {
    const command = `${packageManager} list -g ${packageName} --depth=0`;
    const output = execSync(command, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    });

    const escapedName = packageName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // npm 输出格式：└── packageName@1.0.0 或 `-- packageName@1.0.0
    const npmPattern = new RegExp(`[└\`]--\\s+${escapedName}@([\\d.]+)`, 'm');
    const npmMatch = output.match(npmPattern);
    if (npmMatch && npmMatch[1]) {
      return npmMatch[1];
    }

    // pnpm 输出格式：packageName 1.0.0 或 packageName@1.0.0
    const pnpmPattern1 = new RegExp(`^${escapedName}\\s+([\\d.]+)$`, 'm');
    const pnpmPattern2 = new RegExp(`${escapedName}@([\\d.]+)`, 'm');
    const pnpmMatch1 = output.match(pnpmPattern1);
    const pnpmMatch2 = output.match(pnpmPattern2);

    if (pnpmMatch1 && pnpmMatch1[1]) return pnpmMatch1[1];
    if (pnpmMatch2 && pnpmMatch2[1]) return pnpmMatch2[1];

    return '';
  } catch (error) {
    return '';
  }
}

/**
 * 检查包是否已安装（全局）
 * @param {Object} options - 选项对象
 * @param {string} options.packageManager - 包管理器
 * @param {string} options.packageName - 包名
 * @returns {boolean} 是否已安装
 */
function isPackageInstalledLocal({ packageManager = 'npm', packageName = pkgName } = {}) {
  try {
    const command = `${packageManager} list -g ${packageName} --depth=0`;
    const output = execSync(command, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    });

    const escapedName = packageName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(escapedName).test(output);
  } catch (error) {
    return false;
  }
}

/**
 * 获取本地包管理器
 * @returns {'pnpm' | 'npm'} 包管理器名称
 */
function getPackageManagerLocal() {
  try {
    execSync('which pnpm', { stdio: 'ignore' });
    return 'pnpm';
  } catch (error) {
    return 'npm';
  }
}

module.exports = init;
